import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Media from './../media/media';
import Line from '../line/line';
import Paragraph from './../paragraph/paragraph';

const positionElement = (position, textSize, color, size, hasRadius) => (
  <View style={{ [position]: textSize, flexDirection: 'column', justifyContent: 'center' }}>
    <Media color={color} size={size} hasRadius={hasRadius} />
  </View>
);

/**
 * Create a new Image content
 * @param position Set the image position
 * @param size Media size
 * @param hasRadius Does the media contains radius ?
 * @param animate Animation to do
 * @param lineNumber The number of line to display
 * @param textSize The line text size
 * @param lineSpacing The line spacing distance
 * @param color The media / line color
 * @param width The global lines width
 * @param lastLineWidth The last line width
 * @param firstLineWidth the first line width
 */
function NewsContent({
  position,
  size,
  hasRadius,
  animate,
  lineNumber,
  textSize,
  lineSpacing,
  color,
  width,
  lastLineWidth,
  firstLineWidth,
}) {
  return (
    <View style={{ flexDirection: "column" }}>
        <Paragraph
          animate={animate}
          lineNumber={2}
          textSize={textSize*1.7}
          color={color}
          width={width}
          lastLineWidth={lastLineWidth}
          firstLineWidth={firstLineWidth}
          lineSpacing={lineSpacing}
        />
        <View>
          <View style={{marginTop:20,flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
          <View style={{flexDirection: "row",alignItems: "center"}}>
            <Media color={color} size={{w:40,h:40}} hasRadius={true} />
            <View style={{width:120,height:30,flexDirection: "column",justifyContent: "space-between",marginLeft: 10}}>
              <Line textSize={10} width={"60%"} />
              <Line textSize={8} width={"80%"}/>
            </View>
          </View>
          <Media color={color} size={{w:55,h:30}} hasRadius={false} />
          </View>
        </View>
        <View style={{marginTop: 20,marginBottom:20}}>
          {positionElement('marginRight', textSize, color, size, hasRadius)}
        </View>
        <Paragraph
          animate={animate}
          lineNumber={6}
          textSize={10}
          color={color}
          width={width}
          lastLineWidth={lastLineWidth}
          firstLineWidth={firstLineWidth}
          lineSpacing={lineSpacing}
        />
    </View>
  );
}

NewsContent.propTypes = {
  position: PropTypes.string,
  size: PropTypes.object,
  hasRadius: PropTypes.bool,
  animate: PropTypes.string,
  lineNumber: PropTypes.number.isRequired,
  textSize: PropTypes.number,
  lineSpacing: PropTypes.number,
  color: PropTypes.string,
  width: PropTypes.string,
  lastLineWidth: PropTypes.string,
  firstLineWidth: PropTypes.string,
};

NewsContent.defaultProps = {
  position: 'left',
  size: {w:40,h:40},
  hasRadius: false,
  animate: null,
  textSize: 12,
  lineSpacing: 12,
  color: '#efefef',
  width: '100%',
  lastLineWidth: '100%',
  firstLineWidth: '100%',
};

export default NewsContent;
