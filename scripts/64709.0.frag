/*
 * Original shader from: https://www.shadertoy.com/view/Wd3GRs
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define M_PI 3.14159

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float hash21(vec2 p) {
	p = fract(p*vec2(1.34, 435.345));
    p += dot(p, p+34.23);
    return fract(p.x*p.y);
}

float sphere(vec3 p, float radius) {
    return length(p) - radius;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y;
    vec3 rayOrigin = vec3(0, 0, -1.75);
    vec3 lens = vec3(0, 0, -1);
    vec3 up = vec3(0, 1, 0);
    vec3 cameraAngle = normalize(lens - rayOrigin);
    vec3 right = cross(up, cameraAngle);
    up = cross(cameraAngle, right);
    vec3 planePosition = lens + uv.x * right + uv.y * up;
    vec3 rayDirection = normalize(planePosition - rayOrigin);

    // First march.
    vec3 perpendicularPoint = rayOrigin + dot(-rayOrigin, rayDirection) * rayDirection;
    float firstTotal = 0.;
    for (int i = 0; i < 200; i++) {
        float distance = sphere(rayOrigin, .8);
        rayOrigin += rayDirection * distance;
        firstTotal += distance;
    }
    vec3 minPoint = length(rayOrigin) - .8 < .001 ? rayOrigin : perpendicularPoint;
    // Second march.
    rayOrigin = minPoint;
    rayDirection = normalize(-rayOrigin);
    float secondTotal = 0.;
    float time = iTime + 60.;
    for (int i = 0; i < 16; i++) { // few iterations for a bit of blur
        float distance = -1.;
        for (float j = 0.; j < 12.; j++) {
            float innerRadius = .45;
            float xSpeed = .5 + .5 * hash21(vec2(.2, j * 34.23));
            float x = innerRadius * cos(time * xSpeed);
            float ySpeed = .5 + .5 * hash21(vec2(.4, j * 47.22));
            float y = innerRadius * cos(time * ySpeed);
            float zSpeed = .5 + .5 * hash21(vec2(.6, j * 21.11));
            float z = innerRadius * cos(time * zSpeed);
            vec3 innerSphere = vec3(x, y, z);
            if (length(innerSphere) > .48) {
                innerSphere = normalize(innerSphere) * .48;
            }
            float innerSphereDistance = sphere(rayOrigin - innerSphere, .1);
            if (distance == -1.) {
                distance = innerSphereDistance;
            } else {
            	distance = smin(distance, innerSphereDistance, .2);
            }
        }
        rayOrigin += rayDirection * distance;
        secondTotal += distance;
    }
    // Calculate lighting.
    float d = max(2.5 - firstTotal, 0.) * .1;
    float firstMin = length(minPoint) - .8;
    float glow = max(0., 1. - firstMin * 8.) * (1. - secondTotal) * 1.1;
    glow = max(glow, 0.);
    fragColor.xyz = vec3(d + glow);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}