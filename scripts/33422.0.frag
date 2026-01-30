#ifdef GL_ES
precision mediump float;
#endif

// Try moving your mouse across the field :-)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 posScale = vec2(resolution.y,resolution.x)/sqrt(resolution.x*resolution.y);
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) );
	
	float sum = -1.;
	float qsum = 1.;
	
	for (float i = 0.; i < 150.; i++) {
		float x2 = i*i*.3165+(mouse.x*i*0.01)+.5;
		float y2 = i*.161235+(mouse.y*i*0.01)+.5;
		vec2 p = (fract(position-vec2(x2,y2))-vec2(.5))/posScale;
		float a = (mod(i,2.)==0.?1.:-1.)*atan(p.y,p.x);
		float r = length(p)*100.;
		float e = exp(-r*.5);
		sum += sin(r+a+time)*e;
		qsum += e;
	}
	
	float color = sum/qsum;
	
	gl_FragColor = vec4(mix(vec3(0.,0.5,0.8),vec3(0.9,0.9,1.),clamp((abs(color)-.2)*64.,0.,1.)), 1.0 );
}