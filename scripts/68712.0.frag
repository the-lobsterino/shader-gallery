precision mediump float;

uniform vec2 resolution;
uniform float time;

#define AA 1
#define iTime time
#define iResolution resolution

float mandelbrot( in vec2 c )
{
    {
        float c2 = dot(c, c);
        // skip computation inside M1 - http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm
        if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;
        // skip computation inside M2 - http://iquilezles.org/www/articles/mset_2bulb/mset2bulb.htm
        if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;
    }


    const float B = 256.0;
    float l = 0.0;
    vec2 z  = vec2(0.0);
    for( int i=0; i<512; i++ )
    {
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
        if( dot(z,z)>(B*B) ) break;
        l += 1.0;
    }

    if( l>511.0 ) return 0.0;
    
    // ------------------------------------------------------
    // smooth interation count
    //float sl = l - log(log(length(z))/log(B))/log(2.0);

    // equivalent optimized smooth interation count
    float sl = l - log2(log2(dot(z,z))) + 4.0;

    float al = smoothstep( -0.1, 0.0, 0.0);
    //float al = smoothstep( -0.1, 0.0, sin(0.5*6.2831*iTime ) );
    l = mix( l, sl, al );

    return l;
}

void main()
{
    vec3 col = vec3(0.0);
    

    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        vec2 p = (-iResolution.xy + 2.0*(gl_FragCoord.xy+vec2(float(m),float(n))/float(AA)))/iResolution.y;
        float w = float(AA*m+n);
        float time = iTime + 0.5*(1.0/24.0)*w/float(AA*AA);
    
        float zoo = 0.62 + 0.38*cos(1.0*time);
        zoo = pow( zoo,8.0);
        vec2 c = vec2(-.745,.186) + p*zoo;

        float l = mandelbrot(c);

        col += 0.5 + 0.5*sin((4.0+l*0.4)*vec3(sin(time),sin(time+0.3),sin(time+0.6))*0.3+l*0.15);
        //col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));
    }
    col /= float(AA*AA);

    gl_FragColor  = vec4( col, 1.0 );
}