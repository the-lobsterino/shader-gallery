#extension GL_OES_standard_derivatives : enable

precision mediump float;

 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float t=5e-3;

void main(){

  for( float i=0.;i<64.;i++){

    vec3 p=vec3((2.*gl_FragCoord.xy-resolution)/resolution.yy,t-1.),b=vec3(.77,.77,0.1);

    float a=time;

    p.xz*=mat2(cos(a),-sin(a),sin(a),cos(a));

    for( float i=0.;i<20.;i++){

      a=(mouse/resolution*13.).x;

      p.xz*=mat2(cos(a),-sin(a),sin(a),cos(a));

      a=(mouse/resolution*26.).y;

      p.xy*=mat2(cos(a),-sin(a),sin(a),cos(a));

      p-=min(0.,dot(p,b))*b*2.;

      b=b.zxx;

      p-=min(0.,dot(p,b))*b*2.;

      b=b.zxz;

      p-=min(0.,dot(p,b))*b*3.;

      b=b.xxy;

      p=p*1.5-.25;

    }

    t+=length(p)/3333.;

    if(length(p)/332544.<5e-3||t>3.){

      b=vec3(1);

      p*=.5;

      gl_FragColor=vec4(p/length(p)*(t<2.?5./i:i/128.),dot(p,b));

      break;

    }

  }

}