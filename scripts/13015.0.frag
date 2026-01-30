//uses the bottom row of pixels as ghetto memory to store particle data
//-Khlorghaal
#define particles 10

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define attribs 2

void initParticles(){
	if(int(gl_FragCoord.y)>attribs){
		discard; return;	
	}
}

float dist2(vec2 a, vec2 b){
	vec2 c= (b-a);
	return sqrt( c.x*c.x + c.y*c.y);
}

void main( void ) {
	//if(mouse.y<0.1 || texture2D(backbuffer, vec2(0,0)).xy==vec2(0,0) ){
	//	initParticles();
	//	return;
	//}
	
	if(gl_FragCoord.y < float(attribs)){
		int pID= int(gl_FragCoord.x);
		//ghetto compute shader engage
		//may the machine spirit forgive me as i have sinned
		
		int attrib= int(gl_FragCoord.y);
		//GLES doesnt have switch()
		if(attrib==0){//position
			gl_FragColor= texture2D(backbuffer, vec2(pID,0))+texture2D(backbuffer, vec2(pID,1));
		}
		else if(attrib==1){//velocity
			gl_FragColor= vec4(0,0,0,0);
		}
		return;
	}
	
	vec2 fragpos= gl_FragCoord.xy;
	
	float cumudist=0.;
	
	for(int i=0; i!=particles; i++){
		vec2 partpos= texture2D(backbuffer, vec2(i,0)).xy;
		cumudist+= dist2( mouse, gl_FragCoord.xy/resolution );
	}
	cumudist /= float(particles);
	gl_FragColor = vec4(cumudist, cumudist, cumudist, 1);
//	float col=gl_FragCoord.w/ resolution.x;
//	gl_FragColor = vec4( col,col,col, 1.0 );
	
}