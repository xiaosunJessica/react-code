var isUnitlessNumber = {
	animationIterationCount: true,
	borderImageOutset: true,
	borderImageSlice: true,
	borderImageWidth: true,
	boxFlex: true,
	boxFlexGroup: true,
	boxOrdinalGroup: true,
	columnCount: true,
	columns: true,
	flex: true,
	flexGrow: true,
	flexPositive: true,
	flexShrink: true,
	flexNegative: true,
	flexOrder: true,
	gridArea: true,
	gridRow: true,
	gridRowEnd: true,
	gridRowSpan: true,
	gridRowStart: true,
	gridColumn: true,
	gridColumnEnd: true,
	gridColumnSpan: true,
	gridColumnStart: true,
	fontWeight: true,
	lineClamp: true,
	lineHeight: true,
	opacity: true,
	order: true,
	orphans: true,
	tabSize: true,
	widows: true,
	zIndex: true,
	zoom: true,

	// SVG-related properties
	fillOpacity: true,
	floodOpacity: true,
	stopOpacity: true,
	strokeDasharray: true,
	strokeDashoffset: true,
	strokeMiterlimit: true,
	strokeOpacity: true,
	strokeWidth: true
};
export function dangerousStyleValue(name, value, isCustomProperty) {
	// Note that we've removed escapeTextForBrowser() calls here since the
	// whole string will be escaped when the attribute is injected into
	// the markup. If you provide unsafe user data here they can inject
	// arbitrary CSS which may be problematic (I couldn't repro this):
	// https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	// http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
	// This is not an XSS hole but instead a potential CSS injection issue
	// which has lead to a greater discussion about how we're going to
	// trust URLs moving forward. See #2115901

	var isEmpty = value == null || typeof value === 'boolean' || value === '';
	if (isEmpty) {
		return '';
	}

	if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
		return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
	}

	return ('' + value).trim();
}
export function setValueForStyles(node, styles) {
	var style = node.style;
	for (var styleName in styles) {
		if (!styles.hasOwnProperty(styleName)) {
			continue;
		}
		var isCustomProperty = styleName.indexOf('--') === 0;

		var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
		if (styleName === 'float') {
			styleName = 'cssFloat';
		}
		if (isCustomProperty) {
			style.setProperty(styleName, styleValue);
		} else {
			style[styleName] = styleValue;
		}
	}
}