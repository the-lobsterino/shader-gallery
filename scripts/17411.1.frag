#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//
#define xrepeat 2.0
#define yrepeat 2.0
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float background = pow(clamp(1.01-length(mod(( gl_FragCoord.xy / resolution.xy ),vec2(1.0/xrepeat,1.0/yrepeat))-vec2(0.5/xrepeat,0.5/yrepeat)),0.0,1.0),50.0*(1.1+cos(position.x*35.+position.y*55.0)*0.5))*(0.5+0.5*cos(position.x*46.4+position.y*34.6));
	float circle = pow(clamp(1.01-length(position-vec2(0.5,resolution.y/(resolution.x*2.))),0.0,1.0),50.0)+
		       pow(clamp(1.005-length(position-vec2(0.5+cos(time*0.5)*0.2,resolution.y/(resolution.x*2.)+sin(time*0.5)*0.2)),0.0,1.0),80.0)+
		       pow(clamp(1.002-length(position-vec2(0.5+cos(time*0.5)*0.2+cos(time*1.2)*0.05,resolution.y/(resolution.x*2.)+sin(time*0.5)*0.2+sin(time*1.2)*0.05)),0.0,1.0),120.0)+
		       pow(clamp(1.002-length(position-vec2(0.5+cos(time*0.5)*0.2+cos(time*0.7)*0.025,resolution.y/(resolution.x*2.)+sin(time*0.5)*0.2+sin(time*0.7)*0.025)),0.0,1.0),120.0)+
		       pow(clamp(1.001-length(position-vec2(0.5+cos(time*0.5)*0.2+cos(time*0.9)*0.095,resolution.y/(resolution.x*2.)+sin(time*0.5)*0.2+sin(time*0.9)*0.095)),0.0,1.0),120.0);
	gl_FragColor = vec4( vec3( circle+background,circle+background,pow(circle+background,0.8)), 1.0 );
}