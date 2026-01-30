#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

float hash(float x) {
   return fract(sin(dot(vec2(x,x) ,vec2(12.9898,78.233))) * 43758.5453);
}

bool odd(float x) {
   return (mod(x, 2.0) < 1.0);
}

bool clock() {
	return texture2D(bb,vec2(0.,0.)).r > 0.5;
}

vec4 sort(float x, float y) {
   vec4 prevxy = texture2D(bb,vec2(x,y));
   bool oc = clock();
   if (odd(x*resolution.x) ^^ oc) {
//	   if (odd(y*resolution.y) ^^ oc) {
      vec4 prevxynext = texture2D(bb,vec2(x+1.0/resolution.x,y));
      return vec4(min(prevxy.r,prevxynext.r),min(prevxy.g,prevxynext.g),min(prevxy.b,prevxynext.b),min(prevxy.a,prevxynext.a));
//	   } else {
 //     vec4 prevxynext = texture2D(bb,vec2(x,y+1.0/resolution.y));
  //    return vec4(min(prevxy.r,prevxynext.r),min(prevxy.g,prevxynext.g),min(prevxy.b,prevxynext.b),min(prevxy.a,prevxynext.a));
//	   }
   } else {
//	   if (odd(y*resolution.y) ^^ oc) {
//      vec4 prevxynext = texture2D(bb,vec2(x,y-1.0/resolution.y));
//      return vec4(max(prevxy.r,prevxynext.r),max(prevxy.g,prevxynext.g),max(prevxy.b,prevxynext.b),max(prevxy.a,prevxynext.a));
//	   } else {
      vec4 prevxynext = texture2D(bb,vec2(x-1.0/resolution.x,y));
      return vec4(max(prevxy.r,prevxynext.r),max(prevxy.g,prevxynext.g),max(prevxy.b,prevxynext.b),max(prevxy.a,prevxynext.a));
	//   }
   }
}

void main( void ) {
	vec2 foo = gl_FragCoord.xy / resolution.xy;	
	vec2 position = foo + mouse / 4.0;
	if (int(gl_FragCoord.x) == 0 && int(gl_FragCoord.y) == 0) {
	if (mouse.x > .5) {
		gl_FragColor = vec4(1.0,0.,0.,1.);
		return;
	} else {
		gl_FragColor = vec4(clock()?0.:1.,0.,0.,1.);
	}
		return;
	}
	if (mouse.x > .5) {
	float color = 0.0;
	color += cos( position.x * cos( time / 15.0 ) * 80.0 ) + tan( position.y/8. * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += cos( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	if (color < 0.5) {
		color += hash(position.x)/2.;
	} else {
		color *= hash(position.x);
	}
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
		
	} else {

	    vec4 tmp = sort(foo.x,foo.y);// texture2D(bb, foo);
	gl_FragColor = tmp;
		
	}


}