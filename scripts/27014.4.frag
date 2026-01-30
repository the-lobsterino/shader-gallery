#ifdef GL_ES
precision mediump float;
#endif

// Conway's game of life, nodj.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D prevFrame;

void main( void ) {

	bool oldMe;
	int sum = 0;
	
	for(int i = 0; i<9; i++){
		float i_f = float(i);
		vec2 uv = (gl_FragCoord.xy + vec2(mod(i_f,3.)-1., floor(i_f/3.)-1.))/resolution;
		uv = fract(uv); // toroidal array
		vec4 x = texture2D(prevFrame, uv);
		bool b = x.w>0.2;
		if(i==4){
			oldMe = b;
		}else{
			sum += int(b);	
		}
		
	}
	
	// Compute new state, based on surrounding cells at previous state and Conway's rules.
	bool new;
	if(oldMe){
		new = !(sum<2 || sum>3);
	}else{
		new = (sum==3);
	}
	
	
	if(distance(mouse,vec2(0.5))<0.43){
		float dMouse = distance(gl_FragCoord.xy, mouse*resolution+30.*vec2(sin(time), cos(time)));
		if(dMouse < 20.){
			vec2 gfc = gl_FragCoord.xy;
			if((sin(gfc.x)-sin(gfc.y))>1.1) new = true;
		}
	}
	
	// lower left corner : clear the board
	if(max(mouse.x,mouse.y)<0.1){
		new = false;
	}
	
	
	const vec3 colorSum = vec3(0.9,0.3,1.);
	const vec3 gridColor = vec3(0.,0.8,1.);
	vec3 background = vec3(0.02)+ gridColor*0.15 *(max(step(mod(gl_FragCoord.x,10.),1.),step(mod(gl_FragCoord.y,10.),1.)));
	
	gl_FragColor = vec4(background + vec3(new) + colorSum*float(sum)*0.1, new);
	
}