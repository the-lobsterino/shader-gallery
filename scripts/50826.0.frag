#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 3D triangle logo

// original https://www.shadertoy.com/view/4lGfDc

// use mouse to change logo 

const float Pi = 3.14159265359;   // Kreiszahl

#define S(v)      smoothstep(  9./R.y, 0., v )

void mainImage( out vec4 O, vec2 U )
{
    vec2 R = resolution.xy;
    U = 2.* ( U+U - R ) /R.y;
    vec2 m = 3. + floor(mouse*7.);
    float a = atan(U.y,U.x) - time, l = length(U);
    a = ( mod( m.x*a +Pi, 2.*Pi ) - Pi ) / m.y;
    U = l * vec2(cos(a),sin(a));
    O-=O;
    O +=    S( abs(U.x-.7)-.1 ) * (.5+.5*U.y)
      + .5* S( abs(U.x-.5)-.1 ) * (.5-.5*U.y);
}

void main(void)   
{
  mainImage (gl_FragColor, gl_FragCoord.xy); 
}