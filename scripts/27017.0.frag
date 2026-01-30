#ifdef GL_ES
precision mediump float;
#endif

// game of life, nodj.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D prevFrame;

void main( void ) {

	bool prev[9];
	bool new;
	int sum = 0;
	
	
	
	for(int i = 0; i<9; i++){
		float i_f = float(i);
		vec2 uv = (gl_FragCoord.xy + vec2(mod(i_f,3.)-1., floor(i_f/3.)-1.))/resolution;
		uv = fract(uv);
		vec4 x = texture2D(prevFrame, uv);
		bool b = x.w>0.2;
		prev[i] = b;
		sum += int(b);
	}
	sum-=prev[4]?1:0;
	if(prev[4]){
		new = !(sum<2 || sum>3);
	}else{
		new = (sum==3);
	}
	
	
	float dMouse = distance(gl_FragCoord.xy, mouse*resolution);
	float dd = max(abs(gl_FragCoord.x - resolution.x * .5), abs(gl_FragCoord.y - resolution.y * .5));
	float inf = resolution.x * .2 * sin(time * .1);
	if(resolution.x * .2 * sin(.001 + time * .1) > inf && dd < inf) {
		vec2 gfc = gl_FragCoord.xy;
		new = mod(dd, 8.) < 1.;
	}
	
	
	const vec3 colorSum = vec3(0.9,0.3,1.);
	const vec3 gridColor = vec3(0.,0.8,1.);
	vec3 background = vec3(0.02)+ gridColor*0.15*(max(step(mod(gl_FragCoord.x,10.),1.),step(mod(gl_FragCoord.y,10.),1.)));
	
	gl_FragColor = vec4(background + vec3(new) + colorSum*float(sum)*0.1, new);
	
}