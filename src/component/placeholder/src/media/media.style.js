/**
 * Compute style based on props
 * @param size The media size
 * @param hasRadius Does the media rounded or not ?
 * @param color The media color
 */
export default ({ size = {w:40,h:40}, hasRadius = false, color = '#efefef' }) => ({
  height: size.h,
  width: size.w,
  borderRadius: hasRadius ? size.h / 2 : 3,
  backgroundColor: color,
});
