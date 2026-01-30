// Please tell me how to draw a Lissajous figure without using the loop.
// I tried drawing a lissajous figure without using the loop as follows.
// Please tell me if there is a good way to another.
// (@cx20)


// random passer-by:
// please initialize everything: a thing like
//float b;
// is lazy and evil. i'm not sure if it still shows correctly because i couldn't see what you saw


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2  resolution;

#define PI 3.14159265358979

float plot(float x, float y, vec2 p)
{
    if (distance(vec2(x, y), p) < 0.03)
        return 1.0;
    return 0.0;
}

// 1. case of without a loop 
void main1( void ) {
    float ar = resolution.x / resolution.y;
    vec2 p = gl_FragCoord.xy / resolution;
    p = p * 2.0 - 1.0;
    p.x *= ar;
    vec3 color = vec3(0.0);
    float r = 0.0, g = 0.0, b = 0.0;

    float x = gl_FragCoord.x + gl_FragCoord.y * 512.0;
    float y = gl_FragCoord.y * 512.0;
    
    b += plot(
        0.3 * cos( 2.0 * PI * y / (512.0*512.0) * 32.0 + time * 2.0 ), 
        0.3 * sin( 2.0 * PI * x / (512.0*512.0) * 64.0 + time * 1.0 ), 
        p );

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

    color += vec3(r*0.2, g*0.2, b);
    
    gl_FragColor += vec4(color, 1.0);
}

// 2. case of using a loop
void main2( void ) {
    float ar = resolution.x / resolution.y;
    vec2 p = gl_FragCoord.xy / resolution;
    p = p * 2.0 - 1.0;
    p.x *= ar;
    vec3 color = vec3(0.0);
    float r = 0.0, g = 0.0, b = 0.0;

    const float n = 60.0;
    for ( float i = 0.0; i < n; i++ ) {
        g += plot( 
            0.3 * cos( 2.0 * PI * i/n * 1.0 + time * 2.0 ), 
            0.3 * sin( 2.0 * PI * i/n * 2.0 + time * 1.0 ), 
            p );
    }
    color += vec3(r*0.4, g*0.4, b);

    gl_FragColor += vec4(color, 1.0);
}

void main( void ) {
   // since we're only adding to the existing color in main() and main2()
   gl_FragColor = vec4(0.0);
   // 1. case of without a loop 
    main1();
   // 2. case of using a loop
    main2();
}
