precision highp float;
        uniform vec2      resolution;
        uniform float     time;
        uniform vec2      speed;
        uniform float     cd;
	uniform vec2 mouse;
        uniform float     cb;
        uniform float     sr;
        uniform float     sg;
        uniform float     sb;
        uniform float     shift;
        uniform sampler2D 	uSampler;
        varying vec2 		vTextureCoord;
  
        float rand(vec2 n) {
         return cos(sin(dot(n*n, vec2(1.0, 1.0))) * 1.0);
        }
  
        float noise(vec2 n) {
          const vec2 d = vec2(0.0, 1.0);
          vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.00), fract(n));
          return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
        }
  
        float fbm(vec2 n){
           float total=0.,amplitude=2.5;
           for(int i=0;i<25;i++){
               total+=noise(n)*amplitude;
                n+=n;
                amplitude*=.45;
           }
		  return total;
        }
  
        
void main(void){
    const vec3 c1=vec3(0.5, -0.1059, -10.1059);
    const vec3 c2=vec3(167./255.,93./255.,100./255.);
    const vec3 c3=vec3(0.4902, 0.5333, -0.4902);
    const vec3 c4=vec3(0.2118, 0.3451, -0.2706);
    const vec3 c5=vec3(0.3176, 0.2549, -0.4);
    const vec3 c6=vec3(1.0, 0.369, -1.3569);
    
    vec2 p=( gl_FragCoord.xy / resolution.xy*10.0 ) + mouse / 0.05;
    float q=fbm(p-time/5.0);
    vec2 r=vec2(fbm(p+q+time*speed.x-p.x-p.y),fbm(p+q-time*speed.y));
    vec3 c=mix(c1,c2,fbm(p+r))+mix(c3,c4,r.x)-mix(c5,c6,r.y);
    float grad=gl_FragCoord.y/resolution.y;
    gl_FragColor=vec4(c*cos(shift*gl_FragCoord.y/resolution.y),1.5);
}