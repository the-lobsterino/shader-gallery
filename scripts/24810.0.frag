//OP: "I am trying to learn ray tracing right now. Can someone help me figure out why the lighting isn't being calculated correctly?"

//editor: "The changes I made below are commented with the word 'changed'.  Have fun with getting into Ray Marching Distance Fields!
// for more techniques visit http://www.iquilezles.org/www/index.htm "

precision mediump float;

uniform float time;
uniform vec2 resolution;

#define STEPS 64 /*changed*/
#define FAR 10.0
#define EPS 0.02 /*changed*/ 

			  
float mapSphere(vec3 p) {
	return length(p) - 1.6;
}

vec3 getNormal(vec3 p) {
	vec2 q = vec2(0.0, EPS);
	return vec3( mapSphere(p + q.yxx) - mapSphere(p - q.yxx),
		     mapSphere(p + q.xyx) - mapSphere(p - q.xyx),
		     mapSphere(p + q.xxy) - mapSphere(p - q.xxy) );
}

vec3 shade(vec3 ro, vec3 rd, float t) {
	
	/*changed this whole routine*/
	
	vec3 pos = vec3(ro + t * rd);
	vec3 n = normalize( getNormal(pos) );
	vec3 lightPos = vec3( sin(time) * 2.0, 2.0, cos(time) * -3.0 );
	vec3 lightDir = normalize(-lightPos - pos);
	
	// diffuse: 
	float diffuse = max( 0.0, dot(n, lightDir) );
	vec3 color = vec3(0.0,0.8,0.0);
	color *= diffuse;
	
	// specular: 
	vec3 h = normalize( -rd + lightDir);
	float specular = max( 0.0, dot( n, h ) );
	color += vec3( pow(specular, 16.0) );
	
	return color; 
	
}


void main( void ) {
	
	vec2 uv = 1.0 + -2.0 * (gl_FragCoord.xy / resolution) ;
	uv.x *= resolution.x / resolution.y;
	vec3 ro = vec3(0., 0., 3.0); /*changed*/
	vec3 rd = normalize( vec3(uv, -1.0) ); /*changed*/
	vec3 col = vec3(0.0);
	float t = 0.0; /*changed*/
	float d; /*changed*/
	
	// Ray Marching
	for( int i = 0; i < STEPS; i++ ) {
		d = mapSphere(ro + t * rd);
		if (d < EPS || d > FAR) break;
		t += d;
	}
	
	col = d < EPS ? shade(ro,rd,t): mix(vec3(0.), vec3(.4,.4+sin(time)*.05,.4+cos(time)*.05), 2.25 - length(uv)); /*changed*/
	
	gl_FragColor = vec4(col, 1.0);

}