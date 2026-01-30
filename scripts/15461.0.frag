#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
float R,d,a,b,c,D,L;
vec3 O,P,Y,I,A;
vec2 i=resolution;
vec4 E(vec3 n)
{
	float L=1.-n.y;float b=(n.y+.2);
	
	return vec4(L,L,L+L*b,1.);
}
void main()
{
	A=normalize(vec3(((gl_FragCoord.xy*2.-i)/i.y).xy,-1.));
	R=1.;d=sin(time)+3.;
	O=vec3(cos(time),0.,-d);
	a=length(A);
	a*=a;b=-2.*dot(A,O);
	c=length(O);
	c*=c;c-=R;
	D=b*b-4.*a*c;
	if(D>0.)
	{
		L = (-b-sqrt(D))/(2.*a);P = A * L
;A=P-O;L = (R+P.y)/(-A.y);I=A*L+P;}else{L=-R/A.y;I=A*L;}if(L<0.){gl_FragColor=
E(A);}else{gl_FragColor=vec4(mod(ceil(I.x) + ceil(I.z), 2.0));}}

/*** 7-lins comp ***/

/*
vec4 skyColor(vec3 n)
{
	float lum = 1.-n.y;
	float blue = (n.y+.2);
	return vec4(lum,lum,lum+lum*blue,1.);
}

void main( void ) {
	vec2 pix = (gl_FragCoord.xy*2.-resolution)/resolution.y;
	vec3 rayDir = normalize(vec3(pix.x,pix.y,-1.0));//fov 45
	
	float R,d,a,b,c,D,len,h;
	vec3 O, floorN,refP,refRay,is;
	R = 1.0;//fix
	d = sin(time)+3.;
	O = vec3(cos(time),0.,-d);//y == 0 fix
	floorN = vec3(0.,1.,0.);//floorD equals R fix
	a = length(rayDir);a*=a;
	b = -2.*dot(rayDir,O);
	c = length(O);c*=c;c-=R;
	D = b*b-4.*a*c;
	
	if(D > 0.) {
		len = (-b-sqrt(D))/(2.*a);
		refP = rayDir * len;
		refRay = normalize(refP-O);//refRay.xz*=-1.;
		//gl_FragColor = vec4(refRay,1.0);
		//return;
		h = R + refP.y;
		len = h/(-refRay.y);//ref len
		if(len < 0.) {
			gl_FragColor = skyColor(refRay);
		} else {
			is = refRay * len + refP;
			gl_FragColor = vec4(mod(ceil(is.x)+ceil(is.z),2.0));
		}
	} else {
		len = -R/dot(rayDir, floorN);//rayDir.y
		if(len < 0.0) {
			gl_FragColor = skyColor(rayDir);
		} else {
			vec3 is = rayDir * len;
			gl_FragColor = vec4(mod(ceil(is.x) + ceil(is.z), 2.0));
		}
	}
}*/