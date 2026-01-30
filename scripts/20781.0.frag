// Please tell me how to draw a Lissajous figure without using the loop.
// I tried drawing a lissajous figure without using the loop as follows.
// Please tell me if there is a good way to another.
// (@cx20)


// random passer-by:
// please initialize everything: a thing like
//float b;
// is lazy and evil. i'm not sure if it still shows correctly because i couldn't see what you saw

// passer-by-no-2:
//  making the parameterized variable very jittered over space gives a near-impresssion of the curve
//  bluring it over time improves visibility

#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2  resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
#define PI 3.14159265358979

float plot(float x, float y, vec2 p)
{
    if (distance(vec2(x, y), p) < 0.01)
        return 1.0;
    return 0.0;
}

// 1. case of without a loop 
void main1( void ) {
	vec2 p = surfacePosition*1.0;
	vec3 color = vec3(0.);
	float r = 0.0, g = 0.0, b = 0.0;
	float time = time + PI/2.;
	float fOfXY = abs(p.x)-abs(0.3*sin(  (1./2.)*( asin(p.y/0.3) )-(time*0.5)  ));
	if(abs(fOfXY) < 0.004*(1.+0.1*sin(time*15.))){
		r = g = b =  1.-abs(fOfXY)/0.004;
	}
	fOfXY = abs(p.y)-abs(0.3*sin(  (1./2.)*( asin(p.x/0.3) )-(time*0.5)  ));
	if(abs(fOfXY) < 0.004*(1.+0.1*sin(time*15.))){
		r = g = b =  1.-abs(fOfXY)/0.004;
	}
	// ^-- failed attempt
/*
    // debug
    r += plot(
        p.x, 
        0.3 * sin( 2.0 * PI * x / (512.0*512.0) * 64.0 + time * 1.0 ), 
        p );

    g += plot(
        0.3 * cos( 2.0 * PI * y / (512.0*512.0) * 32.0 + time * 0.5 ), 
        p.y, 
        p );
*/

    color += vec3(b)*4.;
	
    vec4 lastcolor = texture2D(backbuffer, gl_FragCoord.xy / resolution);
    gl_FragColor += vec4(color, 1.0);
    gl_FragColor.b += lastcolor.b*0.97;
    gl_FragColor.r += lastcolor.b*0.2;
    gl_FragColor.g += lastcolor.b*0.6;
}

// 2. case of using a loop
void main2( void ) {
    float ar = resolution.x / resolution.y;
    vec2 p = gl_FragCoord.xy / resolution;
    p = p * 2.0 - 1.0;
    p.x *= ar;
	p = surfacePosition*1.0;
    vec3 color = vec3(0.0);
    float r = 0.0, g = 0.0, b = 0.0;

    const float n = 60.0;
    for ( float i = 0.0; i < n; i++ ) {
        g += plot( 
            0.3 * cos( 2.0 * PI * i/n * 1.0 + time * .2 ), 
            0.3 * sin( 2.0 * PI * i/n * 2.0 + time * .1 ), 
            p );
    }
    color += vec3(r*0.4, g*0.4, b);

    gl_FragColor += vec4(color, 1.0)*1.0*sin(time*.34);
}

void main( void ) {
   // since we're only adding to the existing color in main() and main2()
   gl_FragColor = vec4(0.0);
   // 1. case of without a loop 
    main1();
   // 2. case of using a loop
    main2();
}
