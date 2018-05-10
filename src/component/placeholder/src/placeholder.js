import connect from './placeholderContainer';
import Paragraph from './paragraph/paragraph';
import Media from './media/media';
import Line from './line/line';
import ImageContent from './imageContent/imageContent';
import NewsContent from './newsContent/newsContent';
import VideoList from './videoList/videoList';
import MultiWords from './multiWords/multiWords';

/**
 * Export the placeholder
 */
export default {
  ImageContent: connect(ImageContent),
  NewsContent: connect(NewsContent),
  VideoList: connect(VideoList),
  Paragraph: connect(Paragraph),
  Media: connect(Media),
  Line: connect(Line),
  MultiWords: connect(MultiWords),
  connect,
};
