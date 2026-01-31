#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;


// ----------------------------------------------------------

// https://www.shadertoy.com/view/4tcfW7;
void mainImage( out vec4 fragColor, in vec2 fragCoord, vec2 iResolution, float iTime )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv= uv*2.-1.;
    float l= cos(uv.x*uv.y*exp(5.+mod(iTime-9.,9.)));
    l= l*.5+.5;
    vec3 col = vec3(pow(l,2.2));
    fragColor = vec4(col,1.0);
}

// ----------------------------------------------------------

void main( void )
{
	mainImage( gl_FragColor, gl_FragCoord.xy, resolution, time );
}