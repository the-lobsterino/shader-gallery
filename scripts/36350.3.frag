/*Group E4 ESIEE 2016*/
#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable


#define PI 3.14159265358979
#define N 50


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float r ;
vec2 p,cursor;


void setupAspect(){ 
	p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    	r = mouse.x * mouse.y; 
	cursor = mouse.xy;
	cursor.x *= resolution.x / resolution.y *2.;	
	cursor.y *= resolution.y / resolution.x*2.;
}
struct Circ 
{
	float	size ;
	vec2	pos ;


};


void main( void ){
	setupAspect();
	Circ circle[N];
	
	//background
	//Créer un vecteur de longueur et largeur qui dépend du fragment shader traité (screen fragment).
	vec2 q = vec2(p.x*(3.0/p.y), (6.0/p.y));
	//Récupère le maximum entre le module en x et en y du vecteur (cela dépend ou est situé le vecteur q sur la fenêtre) puis le normalise
	vec3 color = vec3(max(mod((q),1.).x,mod((q),1.).y)/ length(q));
	gl_FragColor = vec4(color,1);
	
	//Les cercles
    	vec3 c=vec3(0);
	float x, y;
	vec2 a = vec2(0.5);
    	for(int i=0;i<N;i++){
		//création de i cercles de type light
		circle[i] = Circ(4., vec2(x,y));
		//paramètre t qui dépend du temps pour le déplacement
		float t = circle[i].size*PI*float(i)/20.*0.2;
		/*
		permet de donner à chaque cercle  une trajectoire d’ellipse différente, et selon le N de cercle pour la boucle et la taille des 
		cercle on obtiendra un cercle complet composé des cercle[i]
		*/
		x = sin(time)*(1.+cos(t));
		y = cos(time)*(1.+sin(t));
		/*
		on applique la trajectoire à chaque cercle, leur position est multipliée par la position de la souris sur x ce qui aura pour effet d’agrandir
		ou de rapetissir le cercle global formé des cercle[i]
		*/
		circle[i].pos= 0.3*vec2(x,y)*cursor.x;
		//la variable d permet d'adapter la couleur en fonction de la position de la souris
		vec3 d = vec3(mouse.x / 3.0, mouse.y / 3.0, r);
		/*
		on ajoute à la variable c une intensité selon la position de chaque point de notre cercle. 
		on divise par length(p+cercle) qui est la distance entre la position du pixel traité et le point en cours de traitement du cercle, nous donnant
		une intensité quasi nulle si le pixel est loin du point du cercle, ou une intensité forte s’ils sont proches
		*/
		c += d*0.08/(length(p+circle[i].pos))*vec3(0.2);
   	}
	//
    	gl_FragColor += vec4(c,1);
}