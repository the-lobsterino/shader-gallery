#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

void main()
{
	vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	vec3 col = vec3(0);
	float t = tan(sin(time*.125))*30.;
	t=time;
	float m = mod(t, 30.);
	uv *= 15.5;
	uv.x *= dot(uv*-8./(sin(time)+1.0),uv*-(cos(time)+4.)*-.2-4.)*.04+10.5;
	//uv.y /= dot(uv,uv)*0.5+1.;
	uv.y *= dot(uv,uv)*3.-200.;
	float d = 0.2-length(uv);
	vec3 c = vec3(d/sin(t)-0.9, d/tan(t)+0.1, cos(t)*d+0.2);
	col += vec3(vec2(d)*rot(t), 0.);
	col += vec3(0., rot(t)*vec2(d));
	col = m>10.?(m>20.?col/c:col-c):col*c;
	col /= 10000.;
	col *= mat3(  0.01,   .009,   .00,
		      .11,   0.23,   .0001,
		      .0,    .11,   .004);
	gl_FragColor = vec4(col,1.0);
}