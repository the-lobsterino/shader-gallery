//Korolev Andrey

//+ Energy Field
// By: Brandon Fogerty



#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float hash( float n ) { return fract(sin(n)*753.5453123); }

// Slight modification of iq's noise function.
float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    
    float n = p.x + p.y*157.0;
    return mix(
                    mix( hash(n+  0.0), hash(n+  1.0),f.x),
                    mix( hash(n+157.0), hash(n+158.0),f.x),
            f.y);
}


float fbm(vec2 p, vec3 a)
{
     float v = 0.0;
     v += noise(p*a.x)*.50;
     v += noise(p*a.y)*.50;
     v += noise(p*a.z)*.125;
     return v;
}

vec3 drawLines( vec2 uv, vec3 fbmOffset,  vec3 color2, vec2 pt1, vec2 pt2 )
{
    float timeVal = time * 0.1;
    vec3 finalColor = vec3( 0.0 );
    float clrFactor = 0.0;	
    float tick = 1.0;	

	
    float r  = distance(uv, pt1) / distance(pt1, pt2);
    
    for( int i=0; i < 1; ++i )
    {
        float indexAsFloat = float(i);
        float amp = 2.5 + (indexAsFloat*7.0);
        float period = 1.0 + (indexAsFloat+8.0);
        float thickness = mix( 0.0, 0.5, noise(uv*7.0) );  
	float t = 0.0;    
	clrFactor = 0.0;
	vec2 ptc = mix(pt1, pt2, r); // ptc = connection point of Hypothetical circle and line calculated with interpolation
	float dist = distance(ptc, uv);  // distance betwenn current pixel (uv) and ptc
	    
	clrFactor = max((tick - r)/(dist+0.0), 0.0);//+1.2*(uv.x*0.1 + fbm( uv+timeVal * period, fbmOffset )*0.7);
		    
	t = 1.0/(r+1.8) + abs( ((clrFactor * thickness) / ( fbm( uv + timeVal * period, fbmOffset ) * amp))  );
	    
        finalColor +=  t * color2 * 0.04;
    }
    
    return finalColor;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) 
{

    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.5;
    uv.x *= resolution.x/resolution.y;
    uv.xy = uv.yx;

    vec3 lineColor1 = vec3( 2.3, 1.5, .5 );
    vec3 lineColor2 = vec3( 1., 1., 1. );
    
    vec3 finalColor = vec3(0.0);

    
    float t = sin( time *80.) * 0.5 + 0.5;
    float pulse = mix( 0.90, 1.0, t);
    uv.x -= 0.3; //fix
vec2 pt2 = vec2(-0.8,1.24548);
vec2 pt7 = vec2(-0.8,-4.24344);

int prevj = 0;
float prevtime;
vec2 prevff;	
prevff = pt2;

vec2 ff[19];	
vec3 ff1[19];	
vec3 ff2[19];		
vec3 ff3[19];			
float r1= 0.0;
float r2= 0.0;	
float r3= 0.0;		
float v= 0.0;		
float v1= 0.0;			
float vv;	
	for (int j = 0; j < 19; j ++ ){
	   r1 =	rand(vec2(j));
	   r2 =	rand(vec2(j+1));	
	   r3 =	0.66 + rand(vec2(j+10)) / 3.0;	
	   ff1[j].x = r1;
	   ff1[j].y = r2;		
	   ff1[j].z = r3;			
	}
	for (int j = 0; j < 19; j ++ ){
	   r1 =	rand(vec2(j+2));
	   r2 =	rand(vec2(j+3));	
           r3 = 0.33 + rand(vec2(j+11)) * 2.0 / 3.0;			
	   ff2[j].x = r1;		
	   ff2[j].y = r2;
	   ff2[j].z = r3;	
	}
	for (int j = 0; j < 19; j ++ ){
	   r1 =	rand(vec2(j+4));
	   r2 =	rand(vec2(j+5));	
           r3 =	rand(vec2(j+12)) / 3.0;			
	   ff3[j].x = r1;		
	   ff3[j].y = r2;
	   ff3[j].z = r3;	
	}
	
	prevj = 0;
	for (int j = 0; j < 19; j ++ ){
	   vv = abs(sin(time*1.0));
	   v = ff1[j].x;
  	   v1 = ff1[j].y;   
		
	   if (vv > ff3[j].z) {
		v = ff3[j].x;
		v1 = ff3[j].y;   
	   } 
	   if (vv > ff2[j].z) {
		v = ff2[j].x; 
		v1 = ff2[j].y;      
	   } 
	   if (vv > ff1[j].z) {
		v = ff1[j].x; 
		v1 = ff1[j].y;      
	   }

	   ff[j].y = pt2.y - v1*0.5 + ((pt7.y-pt2.y)*float(j))/20.0 + sin(sin(2.5+sin(time*0.1)*0.01)*0.1*time*float(j))*0.1;;
	   ff[j].x = -1.2+v+sin(sin(0.2+sin(time*0.01)*0.2)*0.1*time*float(j))*0.1;
           finalColor += drawLines( uv, vec3( 1.0, 2.0, 4.0),  lineColor2, prevff, ff[j] );				
	   prevff = ff[j];	   
	}
	finalColor += drawLines( uv, vec3( 1.0, 2.0, 4.0),  lineColor2, ff[18], pt7 );		
    finalColor = vec3( smoothstep(.03, 1.0,(finalColor.x+finalColor.y+finalColor.z)/3.) )*finalColor*pulse;
    finalColor *= hsv2rgb(vec3(sin( time *0.3) * 0.5 + 0.5, .7, .7 ));
	
    gl_FragColor = vec4( finalColor *50., 1.);

}