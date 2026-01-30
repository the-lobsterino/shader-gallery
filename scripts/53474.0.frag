// nabr - 2017
// Attribution 3.0 International (CC BY 3.0)
// https://creativecommons.org/licenses/by/3.0/
// original https://www.shadertoy.com/view/XlsBRn

// always want to update this thx for watching

precision lowp float;

uniform float time;
uniform vec2 resolution;
void main(){

    float t = time*.1;
	
    vec3 ro = vec3(.0, .0, -15.);
    vec3 rd = normalize(vec3((gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y), 1.));
    
    // ---- rotation 

    float  s = sin(t), c = cos(t);
    mat3 r = mat3(1., 0, 0,0, c, -s,0, s, c) * mat3(c, 0, s,0, 1, 0, -s, 0, c);
	
    // ---- positions 
    vec3  n = vec3(  mod(t,5.)/12.+1.49  );

    // ---- cube length (max(abs(x) - y, 1.) )
    for (int i = 0; i < 8; i++) 
    ro += (length(sin(ro*sin(ro*1.1)*r)-n-cos(3.1)/atan(ro.z*tan(.7)/120.-exp(.0001*t),-rd.z) )-.9) * rd;

    // ---- shading
    gl_FragColor.rgb = 1.-(vec3(.1, 1.25, 0.27)  *-ro.z +0.8);
    gl_FragColor.a = 1.;

}