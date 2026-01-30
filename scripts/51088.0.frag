// inspired by Robert Schütze (trirop)

precision mediump float;
uniform vec2 resolution;
uniform float time;

void main()
{
	vec3 p = vec3((gl_FragCoord.xy)/(resolution.y),sin(time * 0.2));
	for (int i = 0; i < 20; i++)
  {
    p.xzy = vec3(1.3,0.999,0.7)*(abs((abs(p)/dot(p,p)-vec3(1.0,1.0,cos(time * 0.5)*0.5))));
  }
  gl_FragColor.rgb = p;gl_FragColor.a = 1.0;  
}	