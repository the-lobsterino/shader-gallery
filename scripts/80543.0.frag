// https://www.shadertoy.com/view/Ntsfz4

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 fragCoord = gl_FragCoord.xy / 2.0;
    vec2 p = (fragCoord.xy / resolution.xy) - .25;
    p.x *= (resolution.x / resolution.y) * 2.0;    
    p.y += mix(.10, .12, sin(time / 1.));

    vec3 col = sin(vec3(mix(0., 10., cos(time)),0,2) / 10.) * .10 + mix(.1, .5, sin(time * 2.) + 1.);    

    float w = mix(20., 22., cos(time) * 2.);
    
    float rx = mix(.0, 2., sin(time / 2.));
    float r = 0.4 + 0.1 * cos(atan(-p.x + 2., p.y / 2.) * 60.0 + w * -p.x + ((length(mouse) / 150.) * rx));

    float r1 = 0.2 + 0.1 * cos(atan(-p.x + 2., -p.y / 2.) * 5.0 + w * -p.x + (time * 2.));
    float r2 = 0.4 + 0.1 * cos(atan(-p.x + 4., -p.y / 4.) * 10.0 + w * -p.x + (time * 4.));
    float r3 = 0.6 + 0.1 * cos(atan(-p.x + 6., -p.y / 6.) * 20.0 + w * -p.x + (time * 6.));
    
    float q = length(p);

    col *= .0 - (1.0 - smoothstep(r, r * 600., abs(-p.y / 100. * sin(mix(.0, 100., sin(time) + 1.))))) * (.5 - smoothstep(.0, .1, p.y));

    col /= smoothstep(r / 100., r, q) / mix(.05, .2, sin(time) + 1.0);     
    col /= smoothstep(r / 200., r1, q) / mix(.01, .2, sin(time) + 2.0);
    
    col.r /= smoothstep(r2 / 100., r2, q) / .1;
    col.g /= smoothstep(r1 / 100., r1, q) / .3;
    col.b /= smoothstep(r3 / 100., r3, q) / .3;

    gl_FragColor = vec4(col, 1);

}