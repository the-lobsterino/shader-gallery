#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = pow(1.0-abs(0.5+cos(time+position.x*10.0)/20.0-position.y),300.0)+
		pow(1.0-abs(0.6+cos(time+position.x*10.0+0.2)/20.0-position.y),300.0)+
		pow(1.0-abs(0.7+cos(time+position.x*10.0+0.4)/20.0-position.y),300.0)+
		pow(1.0-abs(0.8+cos(time+position.x*10.0+0.6)/20.0-position.y),300.0);
	gl_FragColor = vec4( pow(color,0.3)*sign(position.x-0.25)+color,color,pow(color,0.3)*-sign(position.x-0.25)+color, 1.0 );
}