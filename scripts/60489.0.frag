// big fucks (super-jelly fucked) - glooper2
precision highp float;
uniform float time;
uniform vec2  resolution;

float wv(float x, float t,vec4 vals){
  x = -x;
  return (cos(x * vals.x + t) + sin(x * vals.y + t * 1.0) + cos(x * vals.z + t * 1.0) + sin(x * vals.w + t * 16.0))/8.0;
}

void main(){
	
	vec4 vals = vec4(28.,126.2,18.,53.4);
	
  vec2 p = (gl_FragCoord.xy - 0.5*resolution) / min(resolution.x, resolution.y);
	p.x += sin(time*0.4)*0.2;
	p.y += cos(time*0.4)*0.2;
	p*= 1.1+sin(time)*.2;
	p.y += sin(8.0*p.x+time*0.3)*0.1;
	vals *= 0.7+sin(p.y*-2.0+time*3.7+p.x*4.0)*.15;
	
	p.y += dot(p,p)*0.5;
	p.x *= dot(p,p)*0.2;
  float a = wv(p.x/1.05, time*0.7,vals);
  a += wv(p.y*0.1, time*.32,vals*.895);

	a = (a+pow(a,5.0));
	
	a = smoothstep(-0.5,2.0,a);
  float f = 0.15 / mod(p.x+p.y + a*1.15, 0.4);
  gl_FragColor = vec4(mix(vec3(.95, 1.1, 0.8), vec3(.4, .2, 0.72), f), 1.0);
}
