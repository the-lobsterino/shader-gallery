#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float circ(vec2 pos, vec2 center, float r, float fuzz){
	
	float dist = distance(pos, center);
	
	if(dist <= r){
		return 1.0;
	} else {
		float over = dist-r;
		
		float a = mix(1.0,0.0,over*fuzz);
		
		return a;
	}
	
}

float limit(float val, float max_, float min_){
	
	if(val >= max_){
		return max_;
	} else if (val <= min_){
		return min_;
	} else {
		return val;
	}
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec4 color = vec4(0.0);
	
	float circ_count = 128.0;
	
	for(int i=0; i<129; i++){
		
		float i_f = float(i);
		float i_norm = i_f/(circ_count+1.0);
		
		float y = ((0.8/circ_count)*i_f)+0.1;
		float x = 0.5 + (sin(time+i_f/12.0)/2.0);
		
		vec2 c = vec2(x, y);
		
		float in_circ = limit(circ(position, c, 0.05, 30.0),1.0,0.0);
		
		//color.a = in_circ;
		
		color.r = sin(i_f*3.14);
		color.r = 1.0;

	}

	gl_FragColor = vec4( color);

}