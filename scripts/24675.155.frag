#ifdef GL_ES
precision mediump float;
#endif

uniform float     time;
uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D backbuffer;

void translate2D (inout vec2 v, vec2 d)     { v += d;}

void scale2D     (inout vec2 v, vec2 scale) { v *= scale; }


void mixColor    (inout vec3 target, vec3 color_add, inout float mixFactor) { 
			mixFactor++; 
			target += color_add;

		}


void main()
{
//Initialisation
	vec3 col = vec3(0.0);
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
//	vec3 col_old = texture2D(backbuffer, uv ).rgb;
	
	//uv += (col_old.yx / 6.0) ;
	vec2 xy = uv;
	vec2 center = vec2( 0.0 , 0.0  );
	
	translate2D ( uv , vec2(  -0.5 ) );
	scale2D     ( uv , vec2(  2.0 ) );
	
	vec2 m = mouse;
	translate2D ( m , vec2(  -0.5 ) );
	scale2D     ( m , vec2(  2.0 ) );
		
	float t = time;
		t = 1.0;
	t = 866.0 + .1 * length(uv-m);//+ t * length(uv-m);
		t /= t*(( sin(t*200.1) + 1.1) /2.0);
	vec2 p = vec2(uv.x * cos(uv.x *t ), uv.y * sin( uv.y * t ) );
	vec3 c = vec3( .9 * length(uv-p ));
	
	col = vec3(1.0) - c;
	
	float k = 10.0;
	//col = mod(vec3( (.8*length(uv-p ) )/ k) , c * k) * k ;
	col +=  - .01 * c;
	
	t = 822323.0 + 212.0 * length(uv-m);//+ t * length(uv-m);
		t = t*(( sin(t*200.1) + 1.1) /2.0);
	
	uv += vec2(0.001,0.001);//+ sin( length(col));
	 p = vec2(uv.x * cos(uv.x *t ), uv.y * sin( uv.x * t));
	 c = vec3( .9 * length(uv-m ));
	
	col.g += 1.0 - length(c);
	t = 823.0 + 212.0 * length(uv-m);//+ t * length(uv-m);
		//t = t*(( sin(t*200.1) + 1.1) /2.0);
	
	 k = 100.0;
	
	//col = mod(vec3( (1.*length(uv-m ) )/ k) , c * k) * k ;
	
	 k = 10.0;
	//col = mod(vec3( (1.*length(uv-p ) )/ k) , c * k) * k ;
	col += -vec3(1.0) + c;
	
	uv -= vec2(0.001,-0.001);//* length(col);
	 p = vec2(uv.x * cos(uv.x *t ), uv.y * sin( uv.y * t));
	 c = vec3( .9 * length(uv-p ));
	
	col.b +=  length(c);
	
	 k = 100.0;
	
	
	
	//col = vec3(1.0) + col;
	
	
	float mixFactor = 1.0;
		

	//mixColor( col , col_Plain , mixFactor );
	
	//col /= mixFactor;
	
	
	

	mixFactor = 1.0;
	

	gl_FragColor = vec4( col , 1.0 );

}