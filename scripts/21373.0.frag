#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

//modified to use the alpha channel for state so rgb can be used to add effects
#define mouse mouse/sin(pow(time, 1.100123456789))
float gridSize = 16.0;

int getState(vec2 pixel){
	return int(texture2D(backbuffer,pixel/resolution).a);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	
	int neighbours = 0;
	neighbours += getState(position+vec2(1,0 ));
        neighbours += getState(position-vec2(1,0 ));
	neighbours += getState(position+vec2(0,1 ));
	neighbours += getState(position-vec2(0,1 ));
	neighbours += getState(position+vec2(1,1 ));
	neighbours += getState(position-vec2(1,1 ));
	neighbours += getState(position+vec2(1,-1));
	neighbours += getState(position-vec2(1,-1));
	
	bool current = bool(getState(position));
	
	bool state = false;
	if(current){
		state = neighbours>1&&neighbours<4;
	}else{
		state = neighbours==3;
	}
	
	if (abs(length(position-resolution/2.0) - length((mouse - 0.5) * resolution)) < 1.0 ) {
		state = (fract(sin((time*25.43+position.x*47.52-position.y*74.52))*374.6345) > 0.5);
	}
	
	float glow = float(neighbours)/8.0;
	float cell = float(state);
	
	float back = min(mod(position.x - 0.5, gridSize), mod(position.y - 0.5, gridSize));
	
	vec3 color = vec3((1.0 - ceil(back / gridSize)) * 0.1 + 0.1);
	
	color += vec3(cell, cell, 0); 
	color += vec3(glow, 0, glow * 0.5);
	
	
	gl_FragColor = vec4( color, float(state) );
}