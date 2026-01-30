precision lowp float;

uniform float time;
uniform vec2 resolution;

#define R2(T) mat2(cos(T), sin(T), -sin(T), cos(T))

void main() {
	
    vec2 sp = (gl_FragCoord.xy - .5 * resolution) / max(resolution.x, resolution.y);
    sp *= (R2(3. + time * .03) / cos(time * .4)) * (42. * tan(time * .2)) + R2(dot(sp, sp) + 131.94678 * -((sin(time * .03) * 3.) / sin(time * .3)));

    vec3 col = vec3(0);

    (ceil(sp.y * .05) * sp.x >= cos(sp.y) * sin(sp.x)) ?
        col = vec3(-sp.y, sp.x, 1.- (sp.x - sp.y))
        : col;

    gl_FragColor = vec4(col, 1.0);
}