/**
* All credit goes to Timur Kuzhagaliyev for his discord-spoiler-bot module
* While I do not use his module directly, I *did* use his GifGenerator
* method, which I only slightly modified for my purposes.
*
* Thanks Tim! :)
*/

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/discord-spoiler-bot/wiki
 * @copyright 2017
 * @license MIT
 */

/* eslint-disable */

const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');

const { Font } = Canvas;
const GIFEncoder = require('gifencoder');

const GIF_PATH = path.join(__dirname, '../img/spoilers/gifs');
const FONT_PATH = path.join(__dirname, '../img/spoilers/fonts');
const SOURCE_SANS_PRO = Font ? new Font('SourceSansPro', path.join(FONT_PATH, 'SourceSansPro-Regular.ttf')) : null;

class GifGenerator {
  constructor(gifConfig) {
    if (!gifConfig) gifConfig = {};
    if (!gifConfig.colours) {
      if (gifConfig.colors) {
        gifConfig.colours = gifConfig.colors;
        delete gifConfig.colors;
      } else {
        gifConfig.colours = {};
      }
    }
    /**
     * @type {{margin: number, width: number, lineHeight: number, placeholderText: string, fontSize: string}}
     */
    this.config = Object.assign({
      margin: 10,
      width: 400,
      lineHeight: 40,
      placeholderText: '( Hover to reveal spoiler )',
      fontSize: '13px',
    }, gifConfig);
    /**
         * @type {{background: string, stroke: string, text: string, placeholder: string}}
         */
    this.config.colours = Object.assign({
      background: '#3c3f44',
      stroke: '#b2ac94',
      text: '#c0ba9e',
      placeholder: '#8c8775',
    }, gifConfig.colours);
    this.config.lineWidth = this.config.width - this.config.margin * 2;
  }

  /**
   * @callback done
   * @param {string} filePath
   */

  /**
   * @param {Spoiler} spoiler
   * @param {number} maxLines
   * @param {done} done
   * @return {string}
   */
  createSpoilerGif(spoiler, maxLines, done) {
    const hash = `${spoiler.message.id}-${(new Date()).getTime()}`;
    const gifPath = path.join(GIF_PATH, `${hash}.gif`);
    this.createGif(spoiler, maxLines, gifPath, done);
    return gifPath;
  }

  /**
   * @param {Spoiler} spoiler
   * @param {number} maxLines
   * @param {string} filePath
   * @param {done} done
   */
  createGif(spoiler, maxLines, filePath, done) {
    const lines = this.prepareLines(spoiler, maxLines);
    const height = (lines.length + 0.5) * this.config.lineHeight / 2;
    const context = this.createCanvasContext(height);
    const encoder = this.prepareEncoder(height, filePath, done);
    this.renderSpoilerMessage(context, encoder, height);
    this.renderLines(context, encoder, height, lines);
    encoder.finish();
  }

  /**
   * @param {Spoiler} spoiler
   * @param {number} maxLines
   * @return {string[]}
   */
  prepareLines(spoiler, maxLines) {
    const context = this.createCanvasContext(15);
    return this.breakIntoLines(spoiler.content, context, maxLines);
  }

  /**
   * @param {string} text
   * @param {Context2d} context
   * @param {number} maxLines
   * @return {string[]}
   */
  breakIntoLines(text, context, maxLines) {
    let lines = [];
    const linesBreak = text.split('\n');
    for (let j = 0; j < linesBreak.length; j++) {
      let line = '';
      const words = linesBreak[j].split(' ');
      for (let i = 0; i < words.length; i++) {
        if (line !== '') line += ' ';
        const word = words[i];
        const max = Math.max(context.measureText(line).width, context.measureText(line + word).width);
        if (max > this.config.lineWidth) {
          lines.push(line);
          line = '';
        }
        line += word;
      }
      if (line !== '' || lines.length === 0) {
        lines.push(line);
      }
    }
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[lines.length - 1] += '...';
    }
    return lines;
  }

  /**
   * @param {number} height
   * @param {string} filePath
   * @param {done} done
   * @return {GIFEncoder}
   */
  prepareEncoder(height, filePath, done) {
    const encoder = new GIFEncoder(this.config.width, height);
    const readStream = encoder.createReadStream();
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);
    writeStream.on('close', () => done(filePath));
    encoder.start();
    encoder.setRepeat(-1);
    encoder.setDelay(500);
    encoder.setQuality(10);
    return encoder;
  }

  /**
   * @param {Context2d} context
   * @param {GIFEncoder} encoder
   * @param {number} height
   */
  renderSpoilerMessage(context, encoder, height) {
    this.clearContextBackground(context, height);
    this.renderTextToContext(
      context,
      this.config.lineHeight / 2,
      this.config.placeholderText,
      this.config.colours.placeholder,
    );
    encoder.addFrame(context);
  }

  /**
   * @param {Context2d} context
   * @param {GIFEncoder} encoder
   * @param {number} height
   * @param {string[]} lines
   */
  renderLines(context, encoder, height, lines) {
    this.clearContextBackground(context, height);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const marginTop = this.config.lineHeight / 2 * (i + 1);
      this.renderTextToContext(context, marginTop, line, this.config.colours.text);
    }
    encoder.addFrame(context);
  }

  /**
   * @param {number} height
   * @return {Context2d}
   */
  createCanvasContext(height) {
    const canvas = new Canvas(this.config.width, height);
    const context = canvas.getContext('2d');
    if (SOURCE_SANS_PRO !== null) {
      context.addFont(SOURCE_SANS_PRO);
    }
    const fontName = SOURCE_SANS_PRO !== null ? 'aSourceSansPro' : '"Lucida Sans Unicode"';
    context.font = `${this.config.fontSize} ${fontName}`;
    return context;
  }

  /**
   * @param {Context2d} context
   * @param {number} height
   */
  clearContextBackground(context, height) {
    context.fillStyle = this.config.colours.background;
    context.strokeStyle = this.config.colours.stroke;
    context.rect(0, 0, this.config.width, height);
    context.fill();
    context.stroke();
  }

  /**
   *
   * @param {Context2d} context
   * @param {number} marginTop
   * @param {string} text
   * @param {string} colour
   */
  renderTextToContext(context, marginTop, text, colour) {
    context.fillStyle = colour;
    context.fillText(text, this.config.margin, marginTop);
  }
}

module.exports = GifGenerator;