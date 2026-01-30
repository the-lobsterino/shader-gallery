#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) 
{
	
	vec2 uv = gl_FragCoord.xy / resolution;
	float aspect = resolution.x/resolution.y;
	vec2 p = vec2((gl_FragCoord.x / resolution.y) - mouse.x*aspect ,(gl_FragCoord.y / resolution.y) - mouse.y);
	float size = .1;
	float focus = .0;
	
	if (length(p)<size) focus += .1;
	
	float t = time*.2;
	float decalp = .0;
	float rota = sin(t*3.);
	float rotb = cos(tan(t*1.)*.5);
	float rotc = -sin(t*3.);
	float rotd = -cos(t*3.);
	
	for(float n=.0; n<=16.; ++n)
    	{
        	decalp -= 0.005;
		if (length(vec2(p.x,p.y+decalp))<size-n/4.*.02) focus -= rota;
		if (length(vec2(p.x,p.y-decalp*.8))<size-n/4.*.02) focus -= rotb;
		if (length(vec2(p.x+decalp*.5,p.y))<size-n/4.*.02) focus -= rotc;
		if (length(vec2(p.x-decalp*.5,p.y))<size-n/4.*.02) focus -= rotd;
	}
		
	float backtext = .0;
	float decal = .001;
	float grad = 1.;
	
	float windspeed = 10.;
	float windint = .001;
	uv.x += sin(t*windspeed)*windint;
	uv.y += cos(t*windspeed)*windint;
	float angle = 12.;
	rota = cos(angle);
	rotb = sin(angle);
	rotc = sin(angle);
	rotd = cos(angle);
	
	uv.y -= .04;
		
	for(float n=.0; n<=16.; ++n)
    	{
        	float decaly = n/(9.*16.)*.1;
		float decalx = n/(9.*16.)*.1;
		//grad = (.-n)/4.+5.5;
		grad = 1./9.*(n/16.)*1.;
				
		backtext += texture2D(backbuffer, vec2(uv.x-decalx,uv.y+decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x,uv.y+decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x+decalx,uv.y+decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x-decalx,uv.y)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x,uv.y)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x+decalx,uv.y)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x-decalx,uv.y-decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x,uv.y-decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x+decalx,uv.y-decaly)).r*grad;
	}
	
	
	
	decal = 1.;
	grad = 4.5;
	//backtext -= texture2D(backbuffer, vec2(uv.x,uv.y+decal)).r/grad;
	
	decal = .1;
	grad = 1.5;
	windspeed = 1.;
	windint = .01;
	//uv = gl_FragCoord.xy / resolution;
	//uv.x += sin(t*windspeed)*windint;
	//uv.y += cos(t*windspeed)*windint;
	
	for(float n=.0; n<=16.; ++n)
    	{
        	float decaly = n/(9.*16.)*.1;
		float decalx = n/(9.*16.)*.0051;
		grad = -1./9.*(n/16.)*.1;
				
		backtext += texture2D(backbuffer, vec2(uv.x-decalx,uv.y+decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x,uv.y+decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x+decalx,uv.y+decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x-decalx,uv.y)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x,uv.y)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x+decalx,uv.y)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x-decalx,uv.y-decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x,uv.y-decaly)).r*grad;
		backtext += texture2D(backbuffer, vec2(uv.x+decalx,uv.y-decaly)).r*grad;
	}
	
	float color = mix(focus,backtext*1.,.15);
	float colorb = 1.-pow(1.-mix(focus,backtext*2.,.9999),4.);
	
	gl_FragColor = vec4( color,color-pow(1.-color*0.5,1.2),colorb, 1. );
	//gl_FragColor = vec4( color,color*.2,colorb, 1. );


}