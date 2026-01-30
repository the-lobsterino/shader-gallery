// Random Tiles
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float pulse(float val, float minVal, float maxVal)
{
	return step(maxVal, val) + step(val, minVal);
}

float tile(vec2 p, float borderScale)
{
	float oneMinusBorderScale = 1.0 - borderScale;
	return pulse( p.x, borderScale, oneMinusBorderScale ) + pulse( p.y, borderScale, oneMinusBorderScale );
}

void main( void ) {

	float aspectRatio = resolution.x / resolution.y;
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x *= aspectRatio;
	uv.x = dot(uv,uv);
	vec2 ouv = uv;
	
	float tileZoom = sin(time+uv.x)+8.0;
	uv = mod( uv * tileZoom, 1.0);
	
	float xc = mod( (floor(ouv.x * tileZoom)), 3.0 ); 
	float yc = mod( floor(ouv.y * tileZoom), 3.0 );
	
	float intensity = 0.5;
	xc = mix( 0.1, 0.4, xc ) * intensity;
	yc = mix( 0.1, 0.3, yc ) * intensity;
	
	float scale = 0.08;
	float borderT = tile(uv, scale);
	float fillT = xc+yc;
	
	vec3 borderColor = vec3( borderT*0.3 );
	vec3 fillColor = vec3(fillT);
	
	vec3 finalColor = fillColor + borderColor;

	gl_FragColor = vec4( finalColor, 1.0 );

}