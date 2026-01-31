#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



bool mode;

vec3 fcos( vec3 x )
{
    if( mode) return cos(x);                // naive

    vec3 w = fwidth(x);
    return cos(x) * sin(0.5*w)/(0.5*w);     // filtered-exact
}

vec3 getColor( in float t )
{
    vec3 col = vec3(0.4,0.4,0.4);
    col += 0.12*fcos(6.28318*t*  1.0+vec3(0.0,0.8,1.1));
    col += 0.11*fcos(6.28318*t*  3.1+vec3(0.3,0.4,0.1));
    col += 0.10*fcos(6.28318*t*  5.1+vec3(0.1,0.7,1.1));
    col += 0.09*fcos(6.28318*t*  9.1+vec3(0.2,0.8,1.4));
    col += 0.08*fcos(6.28318*t* 17.1+vec3(0.2,0.6,0.7));
    col += 0.07*fcos(6.28318*t* 31.1+vec3(0.1,0.6,0.7));
    col += 0.06*fcos(6.28318*t* 65.1+vec3(0.0,0.5,0.8));
    col += 0.06*fcos(6.28318*t*115.1+vec3(0.1,0.4,0.7));
    col += 0.09*fcos(6.28318*t*265.1+vec3(1.1,1.4,2.7));
    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
    // coordiantes
    vec2 p = (2.0*fragCoord.xy-resolution.xy)/resolution.y;
    vec2 w = p;
    
    // separation
    float th = 1.8*sin(time);
    mode = (w.x-th<0.0);
    
    // deform 1
    p *= 0.25;
    p = 0.5*p/dot(p,p);
    vec2 q = p;
    p.x += time*0.1;
    
    // deform 2
    p += 0.2*cos( 1.5*p.yx + 0.03*1.0*time + vec2(0.1,1.1) );
	p += 0.2*cos( 2.4*p.yx + 0.03*1.6*time + vec2(4.5,2.6) );
	p += 0.2*cos( 3.3*p.yx + 0.03*1.2*time + vec2(3.2,3.4) );
	p += 0.2*cos( 4.2*p.yx + 0.03*1.7*time + vec2(1.8,5.2) );
	p += 0.2*cos( 9.1*p.yx + 0.03*1.1*time + vec2(6.3,3.9) );

    // base color pattern
    vec3 col = getColor( 0.5*length(p) );
    
    // lighting
    col *= 1.4 - 0.07*length(q);

    // separation
    col *= smoothstep(0.005,0.010,abs(w.x-th));
    
    // palette
    if( w.y<-0.9 ) col = getColor( fragCoord.x/resolution.x );
 
   fragColor = vec4( col, 1.0 );
}

void main( void ) {

	mainImage(gl_FragColor,gl_FragCoord.xy);
	
}