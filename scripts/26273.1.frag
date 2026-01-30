#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// animated calamari
float pieuvreEQ(vec3 p,float t)
{
	float fv = p.x;
	fv = (p.y+length(p*fv)-cos(t+p.y));
	fv = (p.y+length(p*fv)-cos(t+p.y));
	fv = (p.y+length(p*fv)-0.5*cos(t+p.y));
	fv *= fv*0.1;
	return fv;
}
#define MAX_ITER 4
void main( void ) {

	
	vec2 uv = (( gl_FragCoord.xy / resolution.xy )-.5)*3.; 
	float color = 0.0;
	float c = length( vec2(sin(uv.x * 20.+uv.y) + cos(uv.y*time),0.));
        float ct = 1.-pieuvreEQ( vec3(uv.xyx*4.+vec3(sin(time/10.))), time);
        if (ct > 0.){
	  gl_FragColor = vec4( vec3( c ) , 1.0 );
        }else{
	vec2 v_texCoord = gl_FragCoord.xy / resolution;
	
	vec2 p =  v_texCoord * 8.0 - vec2(20.0);
	vec2 i = p;
	
	float c = 1.0;
	
	float inten = .05;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = (time/3.0) * (1.0 - (3.0 / float(n+1)));
		
		i = p + vec2(cos(t - i.x) + sin(t + i.y),
					 sin(t - i.y) + cos(t + i.x));
					 
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),
							 p.y / (cos(i.y+t)/inten)));
	}

	c /= float(MAX_ITER);
	c = 1.5 - sqrt(c);

	vec4 texColor = vec4(2.0, 0.0117647, 0.01568627, 1.0);
	
	texColor.rgb *= pow((1.0 / (1.0 - (c*2.0 + 0.0))), 5.0);
	
	
	gl_FragColor = texColor;
	}
}