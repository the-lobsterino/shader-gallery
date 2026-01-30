// Carl Vitasa

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// function to return a random number
float random (vec2 p) {
	p = fract(p*vec2(123.45, 678.91));
    p += dot(p, p+23.45);
    return fract (p.x * p.y);
}

void main( void )
{

    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;

    vec3 pattern = vec3(0);
    
    
    float units = 30.;
    vec2 gv = fract(uv * units) - .5;
    vec2 id = floor(uv * units) + .5; // add .5 here to center
    
    float d = length(gv);
    
    float minRadius = .2;
    float maxRadius = .4;
    float speed = 10.2;
    float pulseAmount = 1.;
    
    
    float radius = mix(
        minRadius, 
        maxRadius,
        //sin(random(id) * time * speed) * .5 + .5);
        sin(length(pulseAmount*gv - id) - time * speed)*.5+.5); // how to offset sine based on id
    
    float m = smoothstep(radius, radius*.9,d);
    
    pattern += m;

    vec3 color = vec3(random(id));
    gl_FragColor = vec4(color * pattern,1.);
}
