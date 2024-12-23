#include <iostream>
#include <list>
#include <string_view>
#include <cctype> // for isspace
#include <string>

using namespace std;

class LispObject;
class L_Env {
    public:
    unordered_map<string_view, unique_ptr<LispObject>> objMap;
    L_Env(): objMap() {}
};

class LispObject {
public:
    virtual ~LispObject() {}
    virtual void print() const = 0; // 为所有对象提供一个输出接口
    virtual unique_ptr<LispObject> clone() const = 0;
};

class LispString : public LispObject {
public:
    string_view str;
    LispString(string_view str) : str(str) {}

    void print() const override {
        cout << "\"" << str << "\"";
    }

    unique_ptr<LispObject> clone() const {
        return make_unique<LispString>(str);
    }
};

class LispNumber : public LispObject {
public:
    double value;
    LispNumber(double value) : value(value) {}

    void print() const override {
        cout << value;
    }

    unique_ptr<LispObject> clone() const {
        return make_unique<LispNumber>(value);
    }
};

// 分词函数
void tokenize(string_view input, list<string_view>& tokens) {
    auto start = input.begin();
    while (start != input.end()) {
        if (isspace(*start)) {
            ++start; // Skip whitespace
        } else if (*start == '(' || *start == ')') {
            // Handle single-character tokens
            tokens.emplace_back(start, 1); // Create string_view with one char
            ++start;
        } else {
            // Handle general tokens
            auto end = start;
            while (end != input.end() && !isspace(*end) && *end != '(' && *end != ')') {
                ++end;
            }
            tokens.emplace_back(start, std::distance(start, end)); // Create string_view
            start = end;
        }
    }
}

// 执行表达式
unique_ptr<LispObject> exeExpr(L_Env* env, list<string_view>& tokens) {
    if (tokens.empty()) return nullptr;

    auto token = tokens.front();
    tokens.pop_front(); // Remove the first token

    if (token == "(") {
        // Handle more complex expressions, possibly recursive
        token = tokens.front();
        tokens.pop_front();
    }

    // Check if the token is a number
    if (isdigit(token.front())) {
        double value = std::stod(string(token)); // Convert string to number
        return make_unique<LispNumber>(value);
    }

    // Check if the token starts with a letter (variable name)
    if (isalpha(token.front()) || token.front() == '_') {
        // Check if the variable exists in the environment
        auto it = env->objMap.find(token);
        if (it != env->objMap.end()) {
            return it->second->clone(); // Return a clone of the variable's value
        } else {
            // If the variable is not found, handle it (e.g., return null or an error)
            return nullptr;
        }
    }

    // Handle other types of expressions (e.g., "define")
    if (token == "define") {
        // Handle define expression
        string_view var_name = tokens.front();
        tokens.pop_front();

        // Assuming we define a number
        double value = std::stod(string(tokens.front())); // Convert string to number
        tokens.pop_front();

        // Store it into the environment
        env->objMap.emplace(var_name, make_unique<LispNumber>(value));

        return make_unique<LispNumber>(value);
    }

    // Further expressions can be handled here

    return nullptr; // Return null if no known expression type is matched
}


// 执行输入的 tokens
unique_ptr<LispObject>  exe( L_Env* env ,list<string_view>& tokens) {
    if (tokens.empty()) return nullptr;

    if (tokens.front() == "exit") {
        return nullptr; // exit 表示退出
    }

    if (tokens.front() == "(") {
        return exeExpr(env,tokens); // 解析括号中的表达式
    }

    return nullptr;
}

// 运行输入并执行解析和计算
void run(string_view input) {
    L_Env env;
    std::list<std::string_view> tokens;
    tokenize(input, tokens); // 分词

    unique_ptr<LispObject> result = exe(&env, tokens); // 执行表达式

    if (result) {
        result->print(); // 打印结果
        cout << endl;
    } else {
        cout << "No result or exit" << endl;
    }
}

int main() {
    std::string input = "(define square 3.14)";

    run(input); // 运行表达式

    return 0;
}
