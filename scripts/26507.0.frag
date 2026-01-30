#ifdef GL_ES
precision mediump float;
#endif

//matter wave test....

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	
	vec2 pos=gl_FragCoord.xy*0.1;
	vec2 vres=resolution*0.1;
	
	float factor; //need =0. here or else refer to garbage in thumbnail
	float w=0.2;
	float k=0.2;
	factor-=sin(w*time-k*pos.x);
	
	for(int i=0;i<16;++i)
	{
		w+=1.6;
		k+=0.1;
		factor+=sin(w*time-k*pos.x);
		factor-=cos(w*time+k*pos.x);
	}
	
	pos.y+=factor*0.5;
	pos.x-=factor*0.5;
	if(abs(pos.x-vres.x*0.5)<0.4) gl_FragColor=vec4(vec3(1.,0.4,0.4),1.0);
	if(abs(pos.y-vres.y*0.5)<0.8) gl_FragColor=vec4(vec3(0.,0.8,0.8),1.0);
	
}	