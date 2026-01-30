#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

varying vec2 surfacePosition;

const float max_its = 100.;

float mandelbrot(vec2 z_inp, vec2 mouse){
	vec2 c = vec2(mouse.x - 0.5, mouse.y - 0.5) * 2.0;
	vec2 z = vec2(z_inp.x, z_inp.y);
	for (float i = 0.0; i < max_its; ++i) {
		if (abs(dot(z, z)) > 2.0) {
			return i;
		}
		z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
	}
	return max_its;
}
		

void main( void ) {
	vec4 fixed_sample = texture2D(backbuffer, vec2(0.5)/resolution);
	vec4 mouse_sample = texture2D(backbuffer, mouse/resolution);
	
	if(length(gl_FragCoord) < 10.){
		if(length(mouse_sample) >= 1.3){
			fixed_sample.r = .5+.5*cos(time);
			fixed_sample.g = .5+.5*sin(time);
			fixed_sample.b = 1.;
		}else{
			fixed_sample.b = 0.;
		}
		gl_FragColor = vec4(0,0,0,1)+fixed_sample;
		return;
	}
	
	vec4 old_color = texture2D(backbuffer, gl_FragCoord.xy/resolution);
		
	vec2 p = surfacePosition;
	vec2 m = mouse+(fixed_sample.rg-.5)*0.33;
	
	
	gl_FragColor = max(old_color-1./256.
			   , vec4(mandelbrot(p, m)/max_its));

}