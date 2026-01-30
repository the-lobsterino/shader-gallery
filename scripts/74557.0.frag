#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	//arreglar resolución del dibujo
    vec2 uv = gl_FragCoord.xy / resolution,xy;
    float fix = resolution.x/resolution.y;
    uv.x*=fix;
 
    vec2 uv2 = uv;
    
  //translate en horizontal x el tiempo
  uv.x+=time*.1;
  
  uv*=rotate2d(0.5);
  
  //fract con valores distintos en coordenadas xy
  uv.x*= fract(uv.x*10.);
  uv.y*= fract(uv.y*50.);
  
    vec2 p = vec2(0.5,.5) -uv;
    float r = length(p);
    float a = atan(p.x,p.y);
    
    //segunda capa de circulo
    vec2 p2 = vec2(0.5*fix,.5) -uv2;
    float r2 = length(p2);
    float a2 = atan(p2.x,p2.y);
   
   // ejemplo base del uso de fract
   //float e = fract (uv.x*10);
   
   //fraccionar uv, lo que era 0 a 1, ahora dos veces
   // uv = fract(uv*2);

float e = 1.-smoothstep(0.1,0.2,r*r2);
   
	gl_FragColor = vec4(vec3(e), 1.0 );

}