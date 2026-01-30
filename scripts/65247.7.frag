#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*　 http://jp.wgld.org/js4kintro/editor/#precision%20mediump%20float%3B%0Auniform%20float%20t%3B%0Auniform%20vec2%20%20r%3B%0A%0Astruct%20Ray%7B%0A%09vec3%20origin%3B%0A%09vec3%20direction%3B%0A%7D%3B%0A%0Astruct%20Sphere%7B%0A%09float%20radius%3B%0A%09vec3%20%20position%3B%0A%09vec3%20%20color%3B%0A%7D%3B%0A%0Astruct%20Intersection%7B%0A%09bool%20hit%3B%0A%09vec3%20hitPoint%3B%0A%09vec3%20normal%3B%0A%09vec3%20color%3B%0A%7D%3B%0A%0AIntersection%20intersectSphere(Ray%20R%2C%20Sphere%20S)%7B%0A%09Intersection%20i%3B%0A%09vec3%20%20a%20%3D%20R.origin%20-%20S.position%3B%0A%09float%20b%20%3D%20dot(a%2C%20R.direction)%3B%0A%09float%20c%20%3D%20dot(a%2C%20a)%20-%20(S.radius%20*%20S.radius)%3B%0A%09float%20d%20%3D%20b%20*%20b%20-%20c%3B%0A%09if(d%20%3E%200.0)%7B%0A%09%09float%20t%20%3D%20-b%20-%20sqrt(d)%3B%0A%09%09if(t%20%3E%200.0)%7B%0A%09%09%09i.hit%20%3D%20true%3B%0A%09%09%09i.hitPoint%20%3D%20R.origin%20%2B%20R.direction%20*%20t%3B%0A%09%09%09i.normal%20%3D%20normalize(i.hitPoint%20-%20S.position)%3B%0A%09%09%09float%20d%20%3D%20clamp(dot(normalize(vec3(1.0))%2C%20i.normal)%2C%200.1%2C%201.0)%3B%0A%09%09%09i.color%20%3D%20S.color%20*%20d%3B%0A%09%09%09return%20i%3B%0A%09%09%7D%0A%09%7D%0A%09i.hit%20%3D%20false%3B%0A%09i.hitPoint%20%3D%20vec3(0.0)%3B%0A%09i.normal%20%3D%20vec3(0.0)%3B%0A%09i.color%20%3D%20vec3(0.0)%3B%0A%09return%20i%3B%0A%7D%0A%0Avoid%20main(void)%7B%0A%09%2F%2F%20fragment%20position%0A%09vec2%20p%20%3D%20(gl_FragCoord.xy%20*%202.0%20-%20r)%20%2F%20min(r.x%2C%20r.y)%3B%0A%09%0A%09%2F%2F%20ray%20init%0A%09Ray%20ray%3B%0A%09ray.origin%20%3D%20vec3(0.0%2C%200.0%2C%205.0)%3B%0A%09ray.direction%20%3D%20normalize(vec3(p.x%2C%20p.y%2C%20-1.0))%3B%0A%09%0A%09%2F%2F%20sphere%20init%0A%09Sphere%20sphere%3B%0A%09sphere.radius%20%3D%201.0%3B%0A%09sphere.position%20%3D%20vec3(cos(t)%2C%20sin(t)%2C%20cos(t%20*%203.0))%3B%0A%09sphere.color%20%3D%20vec3(1.0)%3B%0A%09%0A%09%2F%2F%20hit%20check%0A%09Intersection%20i%20%3D%20intersectSphere(ray%2C%20sphere)%3B%0A%09gl_FragColor%20%3D%20vec4(i.color%2C%201.0)%3B%0A%7D%0A%0A
の実装を解説した。
*/

//光線の構造体
struct Ray{
    vec3 origin; //始点ベクトル
    vec3 direction; //方向ベクトル
};

//球の構造体
struct Sphere{
    float radius; //半径
    vec3  position; //中心位置
    vec3  color; //色
};

//平面の構造体
struct Plane{
    vec3 position; //代表点
    vec3 normal; //法線ベクトル
    vec3 color; //色
};

//交点の構造体
struct Intersection{
    int   hit; //交差回数
    vec3  hitPoint; //交点位置
    vec3  normal; //法線ベクトル
    vec3  color; //色
    float distance; //交点までの距離
    vec3  rayDir; //対応する光線の方向ベクトル
};

const vec3  LDR = vec3(0.577); //表面輝度
const float EPS = 0.0001;
const int   MAX_REF = 4; //反射の回数

Sphere sphere[3];
Plane plane;

//交点の初期化
void intersectInit(inout Intersection I){
    I.hit      = 0;
    I.hitPoint = vec3(0.0);
    I.normal   = vec3(0.0);
    I.color    = vec3(0.0);
    I.distance = 1.0e+30;
    I.rayDir   = vec3(0.0);
}

//球との交差判定
void intersectSphere(Ray R, Sphere S, inout Intersection I){
    vec3  a = R.origin - S.position;
    float b = dot(a, R.direction);
    float c = dot(a, a) - (S.radius * S.radius);
    float d = b * b - c; //判別式
    float t = -b - sqrt(d); //始点に近い方
    if(d > 0.0 && t > EPS && t < I.distance){ //今の最小距離より小さければ更新
        I.hitPoint = R.origin + R.direction * t;
        I.normal = normalize(I.hitPoint - S.position);
        d = clamp(dot(LDR, I.normal), 0.1, 1.0);
        I.color = S.color * d;
        I.distance = t;
        I.hit++;
        I.rayDir = R.direction;
    }
}

//平面との交差判定
void intersectPlane(Ray R, Plane P, inout Intersection I){
    float d = -dot(P.position, P.normal);
    float v = dot(R.direction, P.normal);
    float t = -(dot(R.origin, P.normal) + d) / v;
    if(t > EPS && t < I.distance){ //今の最小距離より小さければ更新
        I.hitPoint = R.origin + R.direction * t;
        I.normal = P.normal;
        float f = 1.0 - min(abs(I.hitPoint.z), 25.0) * 0.04;
        I.color = P.color * 1.0 * f;
        I.distance = t;
        I.hit++;
        I.rayDir = R.direction;
    }
}

//オブジェクト、平面について交差判定を行う
void intersectExec(Ray R, inout Intersection I){
    intersectSphere(R, sphere[0], I);
    intersectSphere(R, sphere[1], I);
    intersectSphere(R, sphere[2], I);
    intersectPlane(R, plane, I);
}

void main(void){
    // ピクセルの座標
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    //光線(sの初期化
    Ray ray;
    ray.origin = vec3(0.0, 2.0, 6.0);
    ray.direction = normalize(vec3(p.x, p.y, -1.0));

    //球の初期化
    sphere[0].radius = 0.5;
    sphere[0].position = vec3(0.0, -0.5, sin(time));
    sphere[0].color = vec3(1.0, 0.0, 0.0);
    sphere[1].radius = 1.0;
    sphere[1].position = vec3(2.0, 0.0, cos(time * 0.666));
    sphere[1].color = vec3(0.0, 1.0, 0.0);
    sphere[2].radius = 1.5;
    sphere[2].position = vec3(-2.0, 0.5, cos(time * 0.333));
    sphere[2].color = vec3(0.0, 0.0, 1.0);

    //平面の初期化
    plane.position = vec3(0.0, -1.0, 0.0);
    plane.normal = vec3(0.0, 1.0, 0.0);
    plane.color = vec3(1.0);

    //交点の初期化
    Intersection its;
    intersectInit(its);

    //交差判定
    vec3 destColor = vec3(ray.direction.y); //ベースの色
    vec3 tempColor = vec3(1.0);
    Ray q;
    intersectExec(ray, its);
	
    if(its.hit > 0){ //何かに当たっていたら処理開始
        destColor = its.color;
        tempColor *= its.color;
        for(int j = 1; j < MAX_REF; j++){
            q.origin = its.hitPoint + its.normal * EPS; //現在の交点を始点に光線を生成
            q.direction = reflect(its.rayDir, its.normal); 
            intersectExec(q, its); //生成した光線と他のオブジェクトとの交差判定
            if(its.hit > j){
                destColor += tempColor * its.color; //反射を反映
                tempColor *= its.color;
            }
        }
    }
    gl_FragColor = vec4(destColor, 1.0);
}