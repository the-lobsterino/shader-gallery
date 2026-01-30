#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main2( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );


}


uniform int style;
uniform float bodyColorSaturation;
uniform float bodyAlphaMultiplier;
uniform float borderSizeMultiplier;
uniform vec3 colBorder;
uniform vec3 colBody;

const float defaultTransitionSize = 2.011;
const float defaultBorderSize = 2.11;
const float outerShadowSize = 2.08;

vec4 getInnerBodyColor(in vec4 bodyColor)
{
	float brightnessMultiplier = 0.25;
	bodyColor.r = min(1.0, bodyColor.r * (1.0 + 0.5 * brightnessMultiplier) + brightnessMultiplier);
	bodyColor.g = min(1.0, bodyColor.g * (1.0 + 0.5 * brightnessMultiplier) + brightnessMultiplier);
	bodyColor.b = min(1.0, bodyColor.b * (1.0 + 0.5 * brightnessMultiplier) + brightnessMultiplier);
	return vec4(bodyColor);
}

vec4 getOuterBodyColor(in vec4 bodyColor)
{
	float darknessMultiplier = 0.1;
	bodyColor.r = min(1.0, bodyColor.r / (1.0 + darknessMultiplier));
	bodyColor.g = min(1.0, bodyColor.g / (1.0 + darknessMultiplier));
	bodyColor.b = min(1.0, bodyColor.b / (1.0 + darknessMultiplier));
	return vec4(bodyColor);
}


void main( void ) {
	vec2 tex_coord = vec2(115,512);
	//vec2 tex_coord = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float borderSize = defaultBorderSize*borderSizeMultiplier;
	const float transitionSize = defaultTransitionSize;

	// output var
	vec4 out_color = vec4(0.0);
	
	// dynamic color calculations
	vec4 borderColor = vec4(colBorder.x, colBorder.y, colBorder.z, 1.0);
	vec4 bodyColor = vec4(colBody.x, colBody.y, colBody.z, 0.7*bodyAlphaMultiplier);
	vec4 outerShadowColor = vec4(0, 0, 0, 0.25);
	vec4 innerBodyColor = getInnerBodyColor(bodyColor);
	vec4 outerBodyColor = getOuterBodyColor(bodyColor);
	
	innerBodyColor.rgb *= bodyColorSaturation;
	outerBodyColor.rgb *= bodyColorSaturation;
	
	// osu!next style color modifications
		outerBodyColor.rgb = bodyColor.rgb * bodyColorSaturation;
		outerBodyColor.a = 1.0*bodyAlphaMultiplier;
		innerBodyColor.rgb = bodyColor.rgb * 0.5 * bodyColorSaturation;
		innerBodyColor.a = 0.0;
	
	// a bit of a hack, but better than rough edges
	if (borderSizeMultiplier < 0.01)
		borderColor = outerShadowColor;
	
	// conditional variant
	
	if (tex_coord.x < outerShadowSize - transitionSize) // just shadow
	{
		float delta = tex_coord.x / (outerShadowSize - transitionSize);
		out_color = mix(vec4(0), outerShadowColor, delta);
	}
	if (tex_coord.x > outerShadowSize - transitionSize && tex_coord.x < outerShadowSize + transitionSize) // shadow + border
	{
		float delta = (tex_coord.x - outerShadowSize + transitionSize) / (2.0*transitionSize);
		out_color = mix(outerShadowColor, borderColor, delta);
	}
	if (tex_coord.x > outerShadowSize + transitionSize && tex_coord.x < outerShadowSize + borderSize - transitionSize) // just border
	{
		out_color = borderColor;
	}
	if (tex_coord.x > outerShadowSize + borderSize - transitionSize && tex_coord.x < outerShadowSize + borderSize + transitionSize) // border + outer body
	{
		float delta = (tex_coord.x - outerShadowSize - borderSize + transitionSize) / (2.0*transitionSize);
		out_color = mix(borderColor, outerBodyColor, delta);
	}
	if (tex_coord.x > outerShadowSize + borderSize + transitionSize) // outer body + inner body
	{	
		float size = outerShadowSize + borderSize + transitionSize;
		float delta = ((tex_coord.x - size) / (1.0-size));
		out_color = mix(outerBodyColor, innerBodyColor, delta);
	}
	
	
	// linear variant
	
	// just shadow
	float delta = tex_coord.x/(outerShadowSize-transitionSize);
	out_color += mix(vec4(0.0), outerShadowColor, delta) * clamp(ceil(-delta+1.0), 0.0, 1.0);
	
	// shadow + border
	delta = (tex_coord.x - outerShadowSize + transitionSize) / (2.0*transitionSize);
	out_color += mix(outerShadowColor, borderColor, delta) * clamp(ceil(tex_coord.x - (outerShadowSize - transitionSize)), 0.0, 1.0) * clamp(ceil(-abs(delta)+1.0), 0.0, 1.0);
	
	// just border
	out_color += borderColor * clamp(ceil(tex_coord.x - (outerShadowSize + transitionSize)), 0.0, 1.0) * clamp(ceil(-(tex_coord.x - (outerShadowSize + borderSize - transitionSize))), 0.0, 1.0);
	
	// border + outer body
	delta = (tex_coord.x - outerShadowSize - borderSize + transitionSize) / (2.0*transitionSize);
	out_color += mix(borderColor, outerBodyColor, delta) * clamp(ceil(tex_coord.x - (outerShadowSize + borderSize - transitionSize)), 0.0, 1.0) * clamp(ceil(-abs(delta)+1.0), 0.0, 1.0);
	
	// outer body + inner body
	delta = outerShadowSize + borderSize + transitionSize;
	delta = (tex_coord.x - delta) / (1.0-delta); // [VARIABLE REUSING INTENSIFIES]
	out_color += mix(outerBodyColor, innerBodyColor, delta) * clamp(ceil(tex_coord.x - (outerShadowSize + borderSize + transitionSize)), 0.0, 1.0);
	
	
	
	gl_FragColor = out_color;
}