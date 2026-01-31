#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 cPos=vec3(0,0,10);

float dFunc(vec3 p){
	return length(p)-0.2;
}

vec3 trace(vec3 pos,vec3 ray){
	float d;
	vec3 color;
	for(int i=0;i<128;i++){
		d = dFunc(pos);
		pos+=ray*d;
	}
	
	return vec3(d);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy*2. - resolution.xy ) /min(resolution.x,resolution.y);
	
	vec3 ray = normalize(vec3(position,0)-cPos);	
	
	gl_FragColor = vec4( trace(cPos,ray), 1.0 );

}