#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
// origin https://www.shadertoy.com/view/4sSyWz

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( vec2 p )
{
	float h = dot(p,vec2(127.1,311.7));
	
    return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
    
	vec2 u = f*f*(3.0-2.*f);

    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

vec2 CellInCoord(vec2 uv)
{
    // Create a Cell
    vec2 cellW = floor(uv);
    
    // Add random position or noise position 
    vec2 offsetNoise = (vec2(noise(cellW + time * 0.51),noise(cellW* 11.134+ time * 0.5)))*0.5;
    
    // you can use strait hash if you don't need animation
    //vec2 offsetRandom = (vec2(hash(cellW),noise(cellW*10.)))*0.5;
    
    //return cell coordinate + offset
    return cellW + offsetNoise;
}

float dot2(vec2 a) { return dot(a,a); }


float voronoi(vec2 uv)
{
    // Create 9 points around cells Current cell
    vec2 a1 = CellInCoord(uv + vec2(-1.,1.));
    vec2 b1 = CellInCoord(uv + vec2(0.,1.));
    vec2 c1 = CellInCoord(uv + vec2(1.,1.));
    vec2 a2 = CellInCoord(uv + vec2(-1.,0.));
    vec2 b2 = CellInCoord(uv + vec2(0.,0.));
    vec2 c2 = CellInCoord(uv + vec2(1.,0.));
    vec2 a3 = CellInCoord(uv + vec2(-1.,-1.));
    vec2 b3 = CellInCoord(uv + vec2(0.,-1.));
    vec2 c3 = CellInCoord(uv + vec2(1.,-1.));
    
    // get dist
    float la1 = dot2( a1 - uv);
    float lb1 = dot2( b1 - uv);
    float lc1 = dot2( c1 - uv);
    float la2 = dot2( a2 - uv);
    float lb2 = dot2( b2 - uv);
    float lc2 = dot2( c2 - uv);
    float la3 = dot2( a3 - uv);
    float lb3 = dot2( b3 - uv);
    float lc3 = dot2( c3 - uv);
    
    // keep min distance
    float d = la1;
    d = min(d,lb1);
    d = min(d,lc1);
    d = min(d,la2);
    d = min(d,lb2);
    d = min(d,lc2);
    d = min(d,la3);
    d = min(d,lb3);
    d = min(d,lc3);
    
    return sqrt(d);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / resolution.xy;
    uv *= 5.;
    
	float dist = voronoi(uv); // Original
    
    if(uv.x > 2.5) // Fractal test
    {
    	dist += voronoi(uv*2.)*0.5;
        dist += voronoi(uv*4.)*0.25;
    	dist += voronoi(uv*8.)*0.125;
    	dist += voronoi(uv*16.)*0.125*0.5;
    	dist += voronoi(uv*32.)*0.125*0.5*0.5;
    }
    
    if(uv.y > 2.5) // Fliped
    	fragColor = vec4(1. - dist * 0.5);
    else
        fragColor = vec4( dist * 0.5);
        
}

void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy );
}