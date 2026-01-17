#include <iostream>
#include <string>
using namespace std;

class XMLBook {
public:
    string title;
    string author;
    int year;
    double price;

    XMLBook(string t, string a, int y, double p) {
        title = t;
        author = a;
        year = y;
        price = p;
    }
};


class JSONBookStore {
public:
    virtual string getJSON() = 0;
    virtual ~JSONBookStore() {}
};


class XMLtoJSONAdapter : public JSONBookStore {
private:
    XMLBook* xmlBook;

public:
    XMLtoJSONAdapter(XMLBook* book) {
        xmlBook = book;
    }

    string getJSON() override {
        return "{\n"
               "  \"bookstore\": {\n"
               "    \"bookname\": \"" + xmlBook->title +
               " , " + xmlBook->author + "\"\n"
               "  }\n"
               "}";
    }
};

int main() {
    // XML data (from XML file)
    XMLBook xmlBook(
        "A Song of Ice and Fire",
        "George R. R. Martin",
        1996,
        29.99
    );

    // Adapter converts XML to JSON
    JSONBookStore* jsonAdapter = new XMLtoJSONAdapter(&xmlBook);

    // Output JSON
    cout << jsonAdapter->getJSON() << endl;

    delete jsonAdapter;
    return 0;
}
