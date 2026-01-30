// Original shader from: https://twigl.app/?ol=true&ss=-NOQARyGn5NezQ_W45EU

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

void twigl(out vec4 o, vec2 FC, vec2 r, float t) {
  vec3 q,p=vec3(0),n=vec3(0),d=vec3((FC.xy-.5*r)/r.y,.7);
  float e=0.,g=0.;
  p.z += t;
  for(float i=0.;i<1e3;i++) {
    p += d*e*.2;
    g -= e = dot(sin(p),q = cos(p.zxy)) + 1.1;
    n = normalize(cos(p)*q-sin(p)*sin(p.zxy));
    e<.001&&sin(p.y*9.)<0.?p+=n*e,d=reflect(d,n):d;
  }
  o = sqrt(mix(o+ .2, pow(.5 + n.z * (sin(vec4(0,1,2,0) + p.z) * .5), o + 6.), exp(g / 2e2)));
}

void main(void)
{
    twigl(gl_FragColor, gl_FragCoord.xy, resolution, time);
    gl_FragColor.a = 1.;
}