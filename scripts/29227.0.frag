#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float D=8., Z=3.;               // D: duration of advection layers, Z: zoom factor

#define R(U,d) fract( 1e4* sin( U*mat2(1234,-53,457,-17)+d ) )

float M(vec2 U, float t) {           // --- texture layer
// vec2 iU = ceil(U/=exp2(t-8.)),              // quadtree cell Id - infinite zoom
   vec2 iU = ceil(U/=exp2(t-8.)*D/(3.+t)),     // quadtree cell Id - with perspective
          P = .2+.6*R(iU,0.);                  // 1 star position per cell
    float r = 9.* R(iU,1.).x;                  // radius + proba of star ( = P(r<1) )
	return r > 1. ? 1. :   length( P - fract(U) ) * 8./(1.+5.*r) ;
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	vec4 o = vec4(0);
    	vec2 U = (gl_FragCoord.xy / resolution.xy) - 0.5;

	    // --- prepare the timings and weightings of the 3  texture layers

       vec3 P = vec3(-1,0,1)/3., T,
   		      t = fract( time/D + P +.5 )-.5,  // layer time
         	      w = .5+.5*cos(6.28*t);                  // layer weight
       t = t*D+Z;  
    
    // --- prepare the 3 texture layers

    T.x = M(U,t.x),  T.y = M(-U,t.y),  T.z = M(U.yx,t.z); // avoid using same U for all layers
    //T = sin(100.*U.x/exp2(t3))+sin(100.*U.y/exp2(t3));  // try this for obvious pattern
    T = .03/(T*T);

    // --- texture advection: cyclical weighted  sum

    o += dot(w,T);
    // o.rgb = w*T;             // try this alternative to see the 3 layers of texture advection


	gl_FragColor = o;

}