#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float N21(vec2 uv){
	return fract(sin(uv.x*32342. + uv.y*49943.)*1145356.);    
}


float noise(vec2 uv){
    
	vec2 gv = fract(uv);	
	vec2 id = floor(uv);
	
    
    gv = gv*gv*gv*(3.-2.*gv);
    
    float bl = N21(id);
    float br = N21(id+vec2(1,0));
    float b = mix(bl,br,gv.x);
    
    float tl = N21(id+vec2(0,1));
    float tr = N21(id+vec2(1,1));
    float t = mix(tl,tr,gv.x);
    
    float c = mix(b,t,gv.y);
     
    
    return c;
}


#define numOctaves 5
float fbm( in vec2 x, in float H )
{    
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.0;
    float t = 0.0;
    for( int i=0; i<numOctaves; i++ )
    {
        t += a*noise(f*x);
        f *= 2.0;
        a *= G;
    }
    return t;
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x*=resolution.x/resolution.y;

	vec3 col = vec3(0);
	uv-=.5;
	uv*=2.5;
	uv.x +=fbm(uv*203213.,0.+time*.01);
	uv.x+=cos(time*.1)*3.;
	uv.y+=sin(time*.1)*3.;
	col += fbm(uv,-1.)*time*-.001;
	col = mix(vec3(.343546,65773,4324234),vec3(.1234,.6565474,.1235),sin(col.x*.0321)*time*.01*col.y);
	col = mix(col * fbm(col.xz,-1.),vec3(.1234*sin(time*.01),.6565474,.1235),cos(time*.01)*col.x);
	col = vec3(1) -3.*col.y*pow(col.x,time*.1);
	col = fract(col*3.);
	col= vec3(1) - col;
	gl_FragColor = vec4(col, 1.0 );

}