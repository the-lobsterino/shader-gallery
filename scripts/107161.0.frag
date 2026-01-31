#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
 
void main( void ) 
{
	float rg=20.0;
	float dx=0.0/resolution.x;
	float dy=-6.0/resolution.y;
	vec2 pos=vec2(dx,dy);
	vec4 old;
	old.r = texture2D(backbuffer, gl_FragCoord.xy/resolution+pos).r;
	old.g = texture2D(backbuffer, gl_FragCoord.xy/resolution+pos).g;
	old.b = texture2D(backbuffer, gl_FragCoord.xy/resolution+pos).b;
	
	vec3 colore=vec3(0.0);
	
	for(float i=0.0;i<8.0;i++)
	{
		vec2 pos=vec2(0.5+sin(i*0.3+time)/2.0,0.03)*resolution;	
		if(distance(gl_FragCoord.xy, pos) < 6.)
		{
			
			colore.x+=0.002;
			colore.y+=0.004;
			colore.z+=0.002;
			
		}
		else
			colore += vec3(old.x,old.y,old.z)/1.0;
	}
	gl_FragColor = vec4( colore, 1.0 );
}
 
