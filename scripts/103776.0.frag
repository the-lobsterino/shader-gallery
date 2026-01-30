
// muff quim flange twat
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
	uv -=0.5;
	uv.x *= aspectRatio;
	uv.x = dot(uv,uv)*1.5+sin(time*0.2);
	vec2 ouv = uv;
	
	float tileZoom = 5.0;
	uv = mod( uv * tileZoom, 1.0);
	
	float xc = mod( (floor(ouv.x * tileZoom)), 3.0 ); 
	float yc = mod( floor(ouv.y * tileZoom), 3.0 );
	
	float intensity = .3;
	xc = mix( 0.2, 0.4, xc ) * intensity;
	yc = mix( 0.4, 0.6, yc ) * intensity;
	
	float scale = 0.04;
	float borderT = abs(uv.y-uv.x)*0.3;
	float fillT = xc+yc;
	
	vec3 borderColor = vec3( borderT,borderT*0.2,borderT*0.1 );
	
	vec2 uvN1toP1 = uv * 2.0 - 1.0;
	float tpX = 1.0 - pow(abs(uvN1toP1.x), 5.0);
	float tpY = 1.0 - pow(abs(uvN1toP1.y), 6.0);
	
	vec3 fillColor = mix( vec3(.5, 0.4, 0.7), vec3(0.3, .8, 0.32), fillT) * (tpX*tpY);
	
	vec3 finalColor = fillColor*1.1 + borderColor;
	finalColor.xy += 0.02/fillT*abs(sin(finalColor.y*40.0));
	finalColor.xyz+= (tpX+tpY)*abs(sin(time+finalColor.y*32.0))*0.1;

	gl_FragColor = vec4( finalColor, 1.0 );

}