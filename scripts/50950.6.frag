// delz

 
#ifdef GL_ES
precision highp float;
#endif
 
uniform float time;
uniform vec2 resolution;
 
vec3 hsv2rgb_smooth( in vec3 c )
{
	vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
	return c.z * mix( vec3(1.0), rgb, c.y);
}
void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	
	uv *= 38.0;

	uv.x *= sin(time-uv.y*.125)+1.61;
	uv.y *= sin(time-uv.y*.125)+1.61;
	float d = length(uv)*0.06;
	d = d*d;
 
	float a = sin(time*0.61)*d;
	vec3 col = hsv2rgb_smooth(vec3(fract(time*0.4)+(uv.y+uv.x*a)*((d+0.5)*0.05),1.2-d,0.9-d));
	col = clamp(col,0.0,1.0);
	
	
	gl_FragColor = vec4(col, 1.0);
}
 
